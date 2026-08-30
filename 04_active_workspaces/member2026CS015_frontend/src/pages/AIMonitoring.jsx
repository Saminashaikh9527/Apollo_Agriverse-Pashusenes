
import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import {
  getAnimals,
  uploadAIImage,
} from "../api/backend";

// ============================================================
// CONFIG
// ============================================================

const API_BASE_URL = "http://127.0.0.1:8000";

// ============================================================
// HELPERS
// ============================================================

function formatText(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "";
  }

  return String(value)
    .trim()
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
}

function getAnimalId(animal) {
  return (
    animal?.animal_id ??
    animal?.id ??
    animal?.animalId ??
    ""
  );
}

function getDatabaseSpecies(animal) {
  return formatText(
    animal?.animal_type ??
      animal?.species ??
      animal?.animal_species ??
      animal?.type ??
      "Animal"
  );
}

// ============================================================
// YOLO HELPERS
// ============================================================

function getYolo(result) {
  return result?.analysis?.yolo || {};
}

function getYoloDetections(result) {
  const yolo = getYolo(result);

  const detections =
    yolo?.detections ??
    yolo?.results ??
    yolo?.objects ??
    [];

  return Array.isArray(detections)
    ? detections
    : [];
}

function getYoloCount(result) {
  const yolo = getYolo(result);

  if (typeof yolo?.count === "number") {
    return yolo.count;
  }

  if (typeof yolo?.animal_count === "number") {
    return yolo.animal_count;
  }

  return getYoloDetections(result).length;
}

function getDetectionSpecies(item) {
  return (
    item?.species ??
    item?.species_name ??
    item?.class_name ??
    item?.class ??
    item?.name ??
    item?.label ??
    item?.animal_type ??
    "Animal"
  );
}

// ============================================================
// COUNT EACH REAL ANIMAL SPECIES
// ============================================================

function getYoloSpeciesCounts(result) {
  const detections = getYoloDetections(result);

  const counts = {};

  detections.forEach((item) => {
    const species = formatText(
      getDetectionSpecies(item)
    );

    const key = species || "Animal";

    counts[key] =
      (counts[key] || 0) + 1;
  });

  return counts;
}

// ============================================================
// CNN HELPERS
// ============================================================

function getCnn(result) {
  return result?.analysis?.cnn || {};
}

function getCnnPrediction(result) {
  const cnn = getCnn(result);

  const prediction =
    cnn?.prediction ??
    cnn?.predicted_class ??
    cnn?.class_name ??
    cnn?.class ??
    cnn?.label ??
    cnn?.result ??
    cnn?.value;

  if (
    prediction === null ||
    prediction === undefined ||
    prediction === ""
  ) {
    return null;
  }

  if (typeof prediction === "object") {
    return (
      prediction?.label ??
      prediction?.prediction ??
      prediction?.class_name ??
      JSON.stringify(prediction)
    );
  }

  return formatText(prediction);
}

function getCnnConfidence(result) {
  const cnn = getCnn(result);

  const value =
    cnn?.confidence ??
    cnn?.probability ??
    cnn?.score;

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return null;
  }

  return number <= 1
    ? `${(number * 100).toFixed(1)}%`
    : `${number.toFixed(1)}%`;
}

// ============================================================
// COMPONENT
// ============================================================

export default function AIMonitoring() {
  // ==========================================================
  // ANIMALS
  // ==========================================================

  const [animals, setAnimals] = useState([]);

  const [
    selectedAnimalId,
    setSelectedAnimalId,
  ] = useState("");

  const [
    loadingAnimals,
    setLoadingAnimals,
  ] = useState(true);

  // ==========================================================
  // MEDIA
  // ==========================================================

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [mediaType, setMediaType] =
    useState("");

  const [previewUrl, setPreviewUrl] =
    useState("");

  // ==========================================================
  // CAMERA
  // ==========================================================

  const videoRef = useRef(null);

  const [
    cameraOpen,
    setCameraOpen,
  ] = useState(false);

  const [
    cameraStream,
    setCameraStream,
  ] = useState(null);

  // ==========================================================
  // VIDEO RECORDING
  // ==========================================================

  const mediaRecorderRef =
    useRef(null);

  const recordedChunksRef =
    useRef([]);

  const [
    recording,
    setRecording,
  ] = useState(false);

  const [
    recordedVideoUrl,
    setRecordedVideoUrl,
  ] = useState("");

  // ==========================================================
  // AI RESULT
  // ==========================================================

  const [aiResult, setAiResult] =
    useState(null);

  // ==========================================================
  // UI
  // ==========================================================

  const [analyzing, setAnalyzing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  // ==========================================================
  // LOAD ANIMALS
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    async function loadAnimals() {
      try {
        setLoadingAnimals(true);
        setError("");

        const response =
          await getAnimals();

        if (!mounted) return;

        let list = [];

        if (Array.isArray(response)) {
          list = response;
        } else if (
          Array.isArray(response?.animals)
        ) {
          list = response.animals;
        } else if (
          Array.isArray(response?.data)
        ) {
          list = response.data;
        }

        setAnimals(list);

        if (
          !selectedAnimalId &&
          list.length > 0
        ) {
          const firstId =
            getAnimalId(list[0]);

          if (firstId !== "") {
            setSelectedAnimalId(
              String(firstId)
            );
          }
        }
      } catch (err) {
        console.error(
          "Animal loading error:",
          err
        );

        if (mounted) {
          setError(
            err?.message ||
              "Unable to load animals."
          );
        }
      } finally {
        if (mounted) {
          setLoadingAnimals(false);
        }
      }
    }

    loadAnimals();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // SELECTED DATABASE ANIMAL
  // ==========================================================

  const selectedAnimal =
    useMemo(() => {
      return animals.find(
        (animal) =>
          String(
            getAnimalId(animal)
          ) ===
          String(
            selectedAnimalId
          )
      );
    }, [
      animals,
      selectedAnimalId,
    ]);

  // ==========================================================
  // STOP CAMERA
  // ==========================================================

  function stopCamera() {
    if (cameraStream) {
      cameraStream
        .getTracks()
        .forEach((track) =>
          track.stop()
        );
    }

    setCameraStream(null);
    setCameraOpen(false);

    if (videoRef.current) {
      videoRef.current.srcObject =
        null;
    }
  }

  // ==========================================================
  // OPEN CAMERA
  // ==========================================================

  async function openCamera() {
    try {
      setError("");
      setSuccessMessage("");

      stopCamera();

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: true,
            audio: false,
          }
        );

      setCameraStream(stream);
      setCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject =
            stream;

          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      console.error(
        "Camera error:",
        err
      );

      setError(
        "Unable to access camera. Please allow camera permission."
      );
    }
  }

  // ==========================================================
  // CAPTURE CAMERA IMAGE
  // ==========================================================

  function captureCameraImage() {
    if (!videoRef.current) {
      setError(
        "Camera is not ready."
      );
      return;
    }

    const video =
      videoRef.current;

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width =
      video.videoWidth || 1280;

    canvas.height =
      video.videoHeight || 720;

    const context =
      canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError(
            "Unable to capture image."
          );
          return;
        }

        const file =
          new File(
            [blob],
            `camera-animal-${Date.now()}.jpg`,
            {
              type: "image/jpeg",
            }
          );

        setSelectedFile(file);
        setMediaType("image");
        setAiResult(null);
        setSuccessMessage(
          "Animal image captured from camera."
        );
        setError("");

        if (previewUrl) {
          URL.revokeObjectURL(
            previewUrl
          );
        }

        setPreviewUrl(
          URL.createObjectURL(file)
        );

        stopCamera();
      },
      "image/jpeg",
      0.95
    );
  }

  // ==========================================================
  // IMAGE UPLOAD
  // ==========================================================

  function handleImageChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith("image/")
    ) {
      setError(
        "Please select an image file."
      );
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    setSelectedFile(file);
    setMediaType("image");
    setAiResult(null);
    setError("");
    setSuccessMessage("");

    setPreviewUrl(
      URL.createObjectURL(file)
    );
  }

  // ==========================================================
  // OPEN VIDEO RECORDER
  // ==========================================================

  async function openVideoRecorder() {
    try {
      setError("");
      setSuccessMessage("");

      stopCamera();

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: true,
            audio: true,
          }
        );

      setCameraStream(stream);
      setCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject =
            stream;

          videoRef.current.muted =
            true;

          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      console.error(
        "Video camera error:",
        err
      );

      setError(
        "Unable to access camera and microphone. Please allow permission."
      );
    }
  }

  // ==========================================================
  // START RECORDING
  // ==========================================================

  function startRecording() {
    if (!cameraStream) {
      setError(
        "Open the video recorder first."
      );
      return;
    }

    recordedChunksRef.current = [];

    let mimeType =
      "video/webm;codecs=vp9";

    if (
      !MediaRecorder.isTypeSupported(
        mimeType
      )
    ) {
      mimeType =
        "video/webm;codecs=vp8";
    }

    if (
      !MediaRecorder.isTypeSupported(
        mimeType
      )
    ) {
      mimeType = "video/webm";
    }

    const recorder =
      new MediaRecorder(
        cameraStream,
        {
          mimeType,
        }
      );

    mediaRecorderRef.current =
      recorder;

    recorder.ondataavailable =
      (event) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          recordedChunksRef.current.push(
            event.data
          );
        }
      };

    recorder.onstop = () => {
      const blob =
        new Blob(
          recordedChunksRef.current,
          {
            type: mimeType,
          }
        );

      const file =
        new File(
          [blob],
          `animal-video-${Date.now()}.webm`,
          {
            type: mimeType,
          }
        );

      if (recordedVideoUrl) {
        URL.revokeObjectURL(
          recordedVideoUrl
        );
      }

      const url =
        URL.createObjectURL(blob);

      setRecordedVideoUrl(url);
      setSelectedFile(file);
      setMediaType("video");
      setAiResult(null);

      setSuccessMessage(
        "Animal video recorded successfully."
      );

      stopCamera();
    };

    recorder.start();

    setRecording(true);
    setError("");
  }

  // ==========================================================
  // STOP RECORDING
  // ==========================================================

  function stopRecording() {
    const recorder =
      mediaRecorderRef.current;

    if (
      recorder &&
      recorder.state !== "inactive"
    ) {
      recorder.stop();
    }

    setRecording(false);
  }

  // ==========================================================
  // VIDEO FILE UPLOAD
  // ==========================================================

  function handleVideoChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith("video/")
    ) {
      setError(
        "Please select a video file."
      );
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    if (recordedVideoUrl) {
      URL.revokeObjectURL(
        recordedVideoUrl
      );
    }

    const url =
      URL.createObjectURL(file);

    setSelectedFile(file);
    setMediaType("video");
    setPreviewUrl(url);
    setRecordedVideoUrl(url);
    setAiResult(null);

    setError("");
    setSuccessMessage("");
  }

  // ==========================================================
  // CLEAR MEDIA
  // ==========================================================

  function clearMedia() {
    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    if (
      recordedVideoUrl &&
      recordedVideoUrl !== previewUrl
    ) {
      URL.revokeObjectURL(
        recordedVideoUrl
      );
    }

    stopCamera();

    setSelectedFile(null);
    setPreviewUrl("");
    setRecordedVideoUrl("");
    setMediaType("");
    setAiResult(null);
    setSuccessMessage("");
    setError("");
  }

  // ==========================================================
  // ANALYZE IMAGE
  // ==========================================================

  async function handleAnalyzeImage() {
    if (!selectedAnimalId) {
      setError(
        "Please select an Animal ID."
      );
      return;
    }

    if (!selectedFile) {
      setError(
        "Please capture or upload an animal image."
      );
      return;
    }

    if (mediaType !== "image") {
      setError(
        "Please select an image for image analysis."
      );
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setSuccessMessage("");
      setAiResult(null);

      console.log(
        "======================================"
      );

      console.log(
        "PASHUSENSE YOLO + CNN IMAGE ANALYSIS"
      );

      console.log(
        "DATABASE ANIMAL ID:",
        selectedAnimalId
      );

      console.log(
        "DATABASE SPECIES:",
        getDatabaseSpecies(
          selectedAnimal
        )
      );

      console.log(
        "IMAGE:",
        selectedFile.name
      );

      console.log(
        "======================================"
      );

      const result =
        await uploadAIImage(
          selectedFile,
          selectedAnimalId
        );

      console.log(
        "FULL AI RESPONSE:",
        JSON.stringify(
          result,
          null,
          2
        )
      );

      setAiResult(result);

      setSuccessMessage(
        result?.message ||
          "Image analysed successfully using YOLO and CNN."
      );
    } catch (err) {
      console.error(
        "AI image analysis error:",
        err
      );

      setError(
        err?.message ||
          "Image analysis failed."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  // ==========================================================
  // VIDEO ANALYSIS
  // ==========================================================

  async function handleAnalyzeVideo() {
    if (!selectedAnimalId) {
      setError(
        "Please select an Animal ID."
      );
      return;
    }

    if (!selectedFile) {
      setError(
        "Please record or upload an animal video."
      );
      return;
    }

    if (mediaType !== "video") {
      setError(
        "Please select a video."
      );
      return;
    }

    /*
      IMPORTANT:

      Your current backend function is named
      uploadAIImage() and your existing endpoint
      is designed for image upload.

      Therefore this frontend records and previews
      video correctly, but does NOT pretend that
      the image endpoint can analyse video.

      Once backend supports video, replace this
      section with the video endpoint, for example:

      const result = await uploadAIVideo(
        selectedFile,
        selectedAnimalId
      );
    */

    setError(
      "Video recording is ready. Your backend /api/ai/upload currently needs a video-analysis endpoint before YOLO + CNN can analyse the video."
    );
  }

  // ==========================================================
  // RESULT VALUES
  // ==========================================================

  const detectionCount =
    getYoloCount(aiResult);

  const speciesCounts =
    getYoloSpeciesCounts(
      aiResult
    );

  const speciesEntries =
    Object.entries(
      speciesCounts
    );

  const yoloStatus =
    aiResult?.analysis?.yolo
      ?.status ||
    (aiResult
      ? "Completed"
      : "Waiting for analysis");

  const cnnStatus =
    aiResult?.analysis?.cnn
      ?.status ||
    (aiResult
      ? "Completed"
      : "Waiting for analysis");

  const cnnPrediction =
    getCnnPrediction(aiResult);

  const cnnConfidence =
    getCnnConfidence(aiResult);

  // ==========================================================
  // DATABASE ANIMAL TEXT
  // ==========================================================

  const databaseAnimalText =
    selectedAnimal
      ? `Animal ${getAnimalId(
          selectedAnimal
        )} • ${getDatabaseSpecies(
          selectedAnimal
        )}`
      : "No animal selected";

  // ==========================================================
  // YOLO SUMMARY
  // ==========================================================

  const yoloSummary =
    !aiResult
      ? "Waiting for analysis"
      : detectionCount === 0
        ? "No animal detected"
        : `${detectionCount} animal${
            detectionCount === 1
              ? ""
              : "s"
          } detected`;

  // ==========================================================
  // FARM STATUS
  // ==========================================================

  const farmStatus =
    aiResult
      ? detectionCount > 0
        ? "Monitoring active"
        : "No animal detected"
      : "Ready";

  // ==========================================================
  // CLEANUP
  // ==========================================================

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl
        );
      }

      if (
        recordedVideoUrl &&
        recordedVideoUrl !== previewUrl
      ) {
        URL.revokeObjectURL(
          recordedVideoUrl
        );
      }

      if (cameraStream) {
        cameraStream
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      }
    };
  }, []);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Box
      sx={{
        width: "100%",
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          fontWeight={700}
        >
          AI Monitoring 🤖
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Real-time animal detection and
          classification using YOLO and CNN.
        </Typography>
      </Box>

      {/* =====================================================
          STATUS
      ===================================================== */}

      <Alert
        severity="success"
        sx={{ mb: 3 }}
      >
        <strong>
          AI Monitoring Active
        </strong>

        <br />

        Capture an image, record a video,
        or upload animal media for YOLO
        detection and CNN classification.
      </Alert>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>
      )}

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {successMessage && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() =>
            setSuccessMessage("")
          }
        >
          {successMessage}
        </Alert>
      )}

      {/* =====================================================
          LIVE AI VISION
      ===================================================== */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 0.5 }}
          >
            Live AI Vision
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Select an Animal ID and capture,
            record, or upload animal media.
          </Typography>

          <Grid
            container
            spacing={3}
          >
            {/* =================================================
                LEFT
            ================================================= */}

            <Grid
              item
              xs={12}
              md={5}
            >
              {/* ANIMAL ID */}

              <Typography
                fontWeight={600}
                sx={{ mb: 1 }}
              >
                Animal ID
              </Typography>

              {loadingAnimals ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 3,
                  }}
                >
                  <CircularProgress
                    size={20}
                  />

                  <Typography>
                    Loading animals...
                  </Typography>
                </Box>
              ) : (
                <Select
                  fullWidth
                  value={
                    selectedAnimalId
                  }
                  displayEmpty
                  onChange={(event) => {
                    setSelectedAnimalId(
                      event.target.value
                    );

                    setAiResult(null);
                    setError("");
                    setSuccessMessage("");
                  }}
                  sx={{ mb: 3 }}
                >
                  <MenuItem value="">
                    Select Animal ID
                  </MenuItem>

                  {animals.map(
                    (animal) => {
                      const id =
                        getAnimalId(
                          animal
                        );

                      if (
                        id === ""
                      ) {
                        return null;
                      }

                      return (
                        <MenuItem
                          key={id}
                          value={String(id)}
                        >
                          Animal {id}
                          {" • "}
                          {getDatabaseSpecies(
                            animal
                          )}
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
              )}

              {/* DATABASE ANIMAL */}

              {selectedAnimal && (
                <Box
                  sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor:
                      "rgba(0,0,0,0.04)",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Database Animal
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {databaseAnimalText}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Animal selected from
                    the database.
                  </Typography>
                </Box>
              )}

              {/* =================================================
                  MEDIA OPTIONS
              ================================================= */}

              <Typography
                fontWeight={700}
                sx={{ mb: 1.5 }}
              >
                Capture / Upload
              </Typography>

              {/* CAMERA */}

              <Button
                fullWidth
                variant="outlined"
                onClick={openCamera}
                sx={{
                  mb: 1.5,
                  py: 1.4,
                  textTransform:
                    "none",
                }}
              >
                📷 Open Camera
              </Button>

              {/* VIDEO */}

              <Button
                fullWidth
                variant="outlined"
                onClick={
                  openVideoRecorder
                }
                sx={{
                  mb: 1.5,
                  py: 1.4,
                  textTransform:
                    "none",
                }}
              >
                🎥 Record Video
              </Button>

              {/* IMAGE UPLOAD */}

              <Button
                component="label"
                fullWidth
                variant="outlined"
                sx={{
                  mb: 1.5,
                  py: 1.4,
                  textTransform:
                    "none",
                }}
              >
                🖼️ Upload Image

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                />
              </Button>

              {/* VIDEO UPLOAD */}

              <Button
                component="label"
                fullWidth
                variant="outlined"
                sx={{
                  mb: 2,
                  py: 1.4,
                  textTransform:
                    "none",
                }}
              >
                🎬 Upload Video

                <input
                  hidden
                  type="file"
                  accept="video/*"
                  onChange={
                    handleVideoChange
                  }
                />
              </Button>

              {/* SELECTED FILE */}

              {selectedFile && (
                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    backgroundColor:
                      "rgba(0,0,0,0.04)",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Selected Media
                  </Typography>

                  <Typography
                    fontWeight={600}
                    sx={{
                      wordBreak:
                        "break-word",
                    }}
                  >
                    {selectedFile.name}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Type:{" "}
                    {mediaType ===
                    "video"
                      ? "Video"
                      : "Image"}
                  </Typography>
                </Box>
              )}

              {/* CLEAR */}

              {selectedFile && (
                <Button
                  fullWidth
                  variant="text"
                  onClick={clearMedia}
                  sx={{
                    mb: 2,
                    textTransform:
                      "none",
                  }}
                >
                  Clear Media
                </Button>
              )}

              {/* ANALYZE */}

              <Button
                fullWidth
                variant="contained"
                disabled={
                  !selectedFile ||
                  !selectedAnimalId ||
                  analyzing
                }
                onClick={
                  mediaType ===
                  "video"
                    ? handleAnalyzeVideo
                    : handleAnalyzeImage
                }
                sx={{
                  py: 1.4,
                  textTransform:
                    "none",
                }}
              >
                {analyzing ? (
                  <>
                    <CircularProgress
                      size={20}
                      sx={{
                        mr: 1,
                      }}
                    />

                    Analysing...
                  </>
                ) : mediaType ===
                  "video" ? (
                  "Analyse Video"
                ) : (
                  "Analyse Image"
                )}
              </Button>
            </Grid>

            {/* =================================================
                RIGHT PREVIEW
            ================================================= */}

            <Grid
              item
              xs={12}
              md={7}
            >
              {/* CAMERA */}

              {cameraOpen && (
                <Box
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    overflow: "hidden",
                    border:
                      "1px solid rgba(0,0,0,0.15)",
                  }}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: "100%",
                      maxHeight: 420,
                      display: "block",
                      objectFit:
                        "contain",
                      background:
                        "#000",
                    }}
                  />

                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      gap: 1,
                      flexWrap:
                        "wrap",
                    }}
                  >
                    {!recording ? (
                      <>
                        <Button
                          variant="contained"
                          onClick={
                            captureCameraImage
                          }
                        >
                          📷 Capture Image
                        </Button>

                        <Button
                          variant="contained"
                          onClick={
                            startRecording
                          }
                        >
                          🎥 Start Recording
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={
                          stopRecording
                        }
                      >
                        ⏹ Stop Recording
                      </Button>
                    )}

                    <Button
                      variant="outlined"
                      onClick={
                        stopCamera
                      }
                    >
                      Close Camera
                    </Button>
                  </Box>
                </Box>
              )}

              {/* MEDIA PREVIEW */}

              <Box
                sx={{
                  width: "100%",
                  minHeight: 350,
                  border:
                    "1px dashed rgba(0,0,0,0.25)",
                  borderRadius: 2,
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  overflow: "hidden",
                  backgroundColor:
                    "#f8f8f8",
                }}
              >
                {!previewUrl ? (
                  <Typography
                    color="text.secondary"
                  >
                    Capture or upload
                    animal media to
                    preview it here.
                  </Typography>
                ) : mediaType ===
                  "video" ? (
                  <video
                    src={previewUrl}
                    controls
                    playsInline
                    style={{
                      width: "100%",
                      maxHeight: 500,
                      objectFit:
                        "contain",
                      background:
                        "#000",
                    }}
                  />
                ) : (
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Animal preview"
                    sx={{
                      width: "100%",
                      maxHeight: 500,
                      objectFit:
                        "contain",
                    }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* =====================================================
          AI ANIMAL INSIGHTS
      ===================================================== */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 0.5 }}
          >
            AI Animal Insights
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            YOLO detects the real animals
            present in the media. CNN provides
            animal classification separately.
          </Typography>

          {selectedAnimal && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Selected Database Animal
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                {databaseAnimalText}
              </Typography>
            </Box>
          )}

          <Grid
            container
            spacing={2}
          >
            {/* =================================================
                DATABASE
            ================================================= */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography
                    color="text.secondary"
                  >
                    Database Animal
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mt: 1 }}
                  >
                    {selectedAnimal
                      ? getDatabaseSpecies(
                          selectedAnimal
                        )
                      : "Not selected"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Animal ID:{" "}
                    {selectedAnimalId ||
                      "—"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* =================================================
                YOLO COUNT
            ================================================= */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography
                    color="text.secondary"
                  >
                    YOLO Detection
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{ mt: 1 }}
                  >
                    {yoloSummary}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Status:{" "}
                    {yoloStatus}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* =================================================
                CNN
            ================================================= */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography
                    color="text.secondary"
                  >
                    CNN Classification
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mt: 1 }}
                  >
                    {cnnPrediction ||
                      cnnStatus}
                  </Typography>

                  {cnnConfidence && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 1 }}
                    >
                      Confidence:{" "}
                      <strong>
                        {cnnConfidence}
                      </strong>
                    </Typography>
                  )}

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Status:{" "}
                    {cnnStatus}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* =====================================================
          YOLO REAL ANIMAL COUNT
      ===================================================== */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 0.5 }}
          >
            YOLO Animal Count
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            YOLO identifies every detected
            animal separately and groups
            them by detected animal type.
          </Typography>

          {!aiResult ? (
            <Typography
              color="text.secondary"
            >
              Waiting for image analysis.
            </Typography>
          ) : detectionCount ===
            0 ? (
            <Alert severity="warning">
              No animal detected.
            </Alert>
          ) : (
            <>
              {/* TOTAL */}

              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor:
                    "rgba(0,0,0,0.04)",
                }}
              >
                <Typography
                  color="text.secondary"
                >
                  Total Animals Detected
                </Typography>

                <Typography
                  variant="h3"
                  fontWeight={700}
                >
                  {detectionCount}
                </Typography>
              </Box>

              {/* SPECIES */}

              <Grid
                container
                spacing={2}
              >
                {speciesEntries.length >
                0 ? (
                  speciesEntries.map(
                    ([species, count]) => (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={species}
                      >
                        <Card
                          variant="outlined"
                        >
                          <CardContent>
                            <Typography
                              color="text.secondary"
                            >
                              Detected Animal
                            </Typography>

                            <Typography
                              variant="h6"
                              fontWeight={700}
                              sx={{
                                mt: 1,
                              }}
                            >
                              {species}
                            </Typography>

                            <Typography
                              variant="h4"
                              fontWeight={700}
                            >
                              {count}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {count ===
                              1
                                ? "animal detected"
                                : "animals detected"}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  )
                ) : (
                  <Grid
                    item
                    xs={12}
                  >
                    <Typography>
                      {detectionCount} animal
                      {detectionCount ===
                      1
                        ? ""
                        : "s"} detected
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </CardContent>
      </Card>

      {/* =====================================================
          DETECTION DETAILS
      ===================================================== */}

      {aiResult && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Detection Details
            </Typography>

            {getYoloDetections(
              aiResult
            ).length === 0 ? (
              <Typography
                color="text.secondary"
              >
                No individual detection
                details returned by YOLO.
              </Typography>
            ) : (
              <Grid
                container
                spacing={2}
              >
                {getYoloDetections(
                  aiResult
                ).map(
                  (item, index) => {
                    const species =
                      formatText(
                        getDetectionSpecies(
                          item
                        )
                      );

                    const confidence =
                      item?.confidence ??
                      item?.score ??
                      null;

                    const confidenceText =
                      confidence !==
                        null &&
                      confidence !==
                        undefined
                        ? Number(
                            confidence
                          ) <= 1
                          ? `${(
                              Number(
                                confidence
                              ) * 100
                            ).toFixed(1)}%`
                          : `${Number(
                              confidence
                            ).toFixed(1)}%`
                        : "—";

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={index}
                      >
                        <Card
                          variant="outlined"
                        >
                          <CardContent>
                            <Typography
                              color="text.secondary"
                            >
                              Animal{" "}
                              {index + 1}
                            </Typography>

                            <Typography
                              variant="h6"
                              fontWeight={700}
                              sx={{
                                mt: 1,
                              }}
                            >
                              {species ||
                                "Animal"}
                            </Typography>

                            <Typography
                              sx={{
                                mt: 1,
                              }}
                            >
                              Confidence:{" "}
                              <strong>
                                {
                                  confidenceText
                                }
                              </strong>
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  }
                )}
              </Grid>
            )}
          </CardContent>
        </Card>
      )}

      {/* =====================================================
          CNN RESULT
      ===================================================== */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            CNN Classification
          </Typography>

          {!aiResult ? (
            <Typography
              color="text.secondary"
            >
              CNN result will appear after
              image analysis.
            </Typography>
          ) : (
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor:
                  "rgba(0,0,0,0.04)",
              }}
            >
              <Typography
                color="text.secondary"
              >
                Predicted Animal
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ mt: 1 }}
              >
                {cnnPrediction ||
                  "Not available"}
              </Typography>

              {cnnConfidence && (
                <Typography
                  sx={{ mt: 1 }}
                >
                  Confidence:{" "}
                  <strong>
                    {cnnConfidence}
                  </strong>
                </Typography>
              )}

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                CNN Status:{" "}
                {cnnStatus}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* =====================================================
          FARM STATUS
      ===================================================== */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 0.5 }}
          >
            AI Vision Summary
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Summary of YOLO detection and
            CNN classification.
          </Typography>

          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              sm={4}
            >
              <Typography
                color="text.secondary"
              >
                YOLO
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                {yoloSummary}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={4}
            >
              <Typography
                color="text.secondary"
              >
                CNN
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                {cnnPrediction ||
                  "Waiting for analysis"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={4}
            >
              <Typography
                color="text.secondary"
              >
                Farm Status
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                {farmStatus}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

