// ============================================================
// src/pages/DigitalTwin.jsx
// Apollo Agriverse - PashuSense
// ============================================================

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
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
// HELPERS
// ============================================================

function formatSpecies(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  const text = String(value)
    .trim()
    .replace(/[_-]+/g, " ");

  if (!text) {
    return "";
  }

  return text
    .split(/\s+/)
    .map((word) => {
      if (!word) return "";

      return (
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
      );
    })
    .join(" ");
}

// ============================================================
// ANIMAL ID
// ============================================================

function getAnimalId(animal) {
  return (
    animal?.animal_id ??
    animal?.id ??
    animal?.animalId ??
    ""
  );
}

// ============================================================
// ANIMAL TYPE
// ============================================================

function getAnimalType(animal) {
  if (!animal) {
    return "Animal";
  }

  return formatSpecies(
    animal?.animal_type ||
      animal?.species ||
      animal?.type ||
      animal?.animal_species ||
      "Animal"
  );
}

// ============================================================
// ANIMAL TAG
// ============================================================

function getAnimalTag(animal) {
  return (
    animal?.tag_number ||
    animal?.tag ||
    animal?.animal_tag ||
    animal?.tag_id ||
    ""
  );
}

// ============================================================
// DETECTED SPECIES
// ============================================================

function getDetectedSpecies(result) {
  const analysis =
    result?.analysis;

  if (!analysis) {
    return null;
  }

  // Direct backend value.
  const directSpecies =
    analysis?.detected_species;

  if (
    directSpecies &&
    String(directSpecies).trim()
  ) {
    return formatSpecies(
      directSpecies
    );
  }

  // YOLO detections.
  const detections =
    analysis?.yolo?.detections;

  if (
    Array.isArray(detections) &&
    detections.length > 0
  ) {
    const species = detections
      .map(
        (item) =>
          item?.species ||
          item?.species_name ||
          item?.class_name ||
          item?.class ||
          item?.name ||
          item?.label ||
          ""
      )
      .filter(Boolean)
      .map(formatSpecies);

    const uniqueSpecies =
      [...new Set(species)];

    if (uniqueSpecies.length > 0) {
      return uniqueSpecies.join(", ");
    }
  }

  return null;
}

// ============================================================
// YOLO CONFIDENCE
// ============================================================

function getDetectionConfidence(result) {
  const yolo =
    result?.analysis?.yolo;

  if (
    typeof yolo?.confidence === "number"
  ) {
    return yolo.confidence;
  }

  if (
    typeof yolo?.confidence?.best === "number"
  ) {
    return yolo.confidence.best;
  }

  if (
    typeof yolo?.best_confidence === "number"
  ) {
    return yolo.best_confidence;
  }

  const detections =
    yolo?.detections;

  if (
    Array.isArray(detections) &&
    detections.length > 0
  ) {
    const values =
      detections
        .map(
          (item) =>
            Number(
              item?.confidence
            )
        )
        .filter(
          (value) =>
            Number.isFinite(value)
        );

    if (values.length > 0) {
      return Math.max(...values);
    }
  }

  return null;
}

// ============================================================
// YOLO COUNT
// ============================================================

function getDetectionCount(result) {
  const count =
    result?.analysis?.yolo?.count;

  if (
    typeof count === "number"
  ) {
    return count;
  }

  const totalAnimals =
    result?.analysis?.yolo?.total_animals;

  if (
    typeof totalAnimals === "number"
  ) {
    return totalAnimals;
  }

  const detections =
    result?.analysis?.yolo?.detections;

  if (
    Array.isArray(detections)
  ) {
    return detections.length;
  }

  return 0;
}

// ============================================================
// CNN CLASSIFICATION
// ============================================================

function getCNNClassification(result) {
  const cnn =
    result?.analysis?.cnn;

  return (
    cnn?.classification ||
    cnn?.prediction ||
    cnn?.result ||
    cnn?.class_name ||
    cnn?.class ||
    null
  );
}

// ============================================================
// CNN CONFIDENCE
// ============================================================

function getCNNConfidence(result) {
  const cnn =
    result?.analysis?.cnn;

  const value =
    cnn?.confidence ??
    cnn?.probability ??
    cnn?.score;

  if (
    typeof value === "number"
  ) {
    return value;
  }

  return null;
}

// ============================================================
// CNN TOP PREDICTIONS
// ============================================================

function getTopCNNPredictions(result) {
  const cnn =
    result?.analysis?.cnn;

  const predictions =
    cnn?.top_predictions ||
    cnn?.predictions ||
    cnn?.top_classes;

  if (
    Array.isArray(predictions)
  ) {
    return predictions;
  }

  return [];
}

// ============================================================
// HEALTH DISPLAY
// ============================================================

function getHealth(result) {
  const classification =
    getCNNClassification(result);

  if (classification) {
    return formatSpecies(
      classification
    );
  }

  const health =
    result?.analysis?.health;

  if (
    typeof health === "string"
  ) {
    return health;
  }

  if (
    health &&
    typeof health === "object"
  ) {
    return (
      health?.prediction ||
      health?.classification ||
      health?.result ||
      health?.status ||
      "Not available"
    );
  }

  return "Not available";
}

// ============================================================
// BEHAVIOUR
// ============================================================

function getBehaviour(result) {
  const analysis =
    result?.analysis;

  const value =
    analysis?.behaviour ||
    analysis?.behavior ||
    analysis?.xgboost?.behaviour ||
    analysis?.xgboost?.behavior;

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not available";
  }

  if (
    typeof value === "object"
  ) {
    return (
      value?.prediction ||
      value?.result ||
      value?.status ||
      "Not available"
    );
  }

  return String(value);
}

// ============================================================
// ACTIVITY
// ============================================================

function getActivity(result) {
  const analysis =
    result?.analysis;

  const value =
    analysis?.activity ||
    analysis?.movement ||
    analysis?.xgboost?.activity;

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not available";
  }

  if (
    typeof value === "object"
  ) {
    return (
      value?.prediction ||
      value?.result ||
      value?.status ||
      "Not available"
    );
  }

  return String(value);
}

// ============================================================
// PERCENTAGE
// ============================================================

function formatConfidence(value) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(
      Number(value)
    )
  ) {
    return "—";
  }

  const number =
    Number(value);

  const percentage =
    number <= 1
      ? number * 100
      : number;

  return `${percentage.toFixed(1)}%`;
}

// ============================================================
// COMPONENT
// ============================================================

export default function DigitalTwin() {
  const [animals, setAnimals] =
    useState([]);

  const [
    selectedAnimalId,
    setSelectedAnimalId,
  ] = useState("");

  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);

  const [
    previewUrl,
    setPreviewUrl,
  ] = useState("");

  const [
    aiResult,
    setAiResult,
  ] = useState(null);

  const [
    loadingAnimals,
    setLoadingAnimals,
  ] = useState(true);

  const [
    analyzing,
    setAnalyzing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  // ==========================================================
  // LOAD ANIMALS
  // IMPORTANT:
  // This effect runs ONCE.
  // It must NOT depend on selectedAnimalId.
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    async function loadAnimals() {
      try {
        setLoadingAnimals(true);
        setError("");

        const response =
          await getAnimals();

        if (!mounted) {
          return;
        }

        let list = [];

        if (
          Array.isArray(response)
        ) {
          list = response;
        } else if (
          Array.isArray(
            response?.animals
          )
        ) {
          list =
            response.animals;
        } else if (
          Array.isArray(
            response?.data
          )
        ) {
          list =
            response.data;
        }

        setAnimals(list);

        // Do not automatically invent an ID.
        // Select an ID only when an actual
        // database animal exists.
        if (
          list.length > 0 &&
          !selectedAnimalId
        ) {
          const firstId =
            getAnimalId(list[0]);

          if (
            firstId !== "" &&
            firstId !== null &&
            firstId !== undefined
          ) {
            setSelectedAnimalId(
              String(firstId)
            );
          }
        }
      } catch (err) {
        console.error(
          "Failed to load animals:",
          err
        );

        if (!mounted) {
          return;
        }

        if (
          err?.status === 401 ||
          err?.isUnauthorized
        ) {
          setError(
            "Your login session has expired. Please login again."
          );
        } else {
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

    // IMPORTANT:
    // Do NOT put selectedAnimalId here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================================
  // SELECTED ANIMAL
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
  // FILE SELECT
  // ==========================================================

  function handleFileChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
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

    const url =
      URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(url);

    setAiResult(null);
    setError("");
    setSuccessMessage("");
  }

  // ==========================================================
  // ANALYZE
  // ==========================================================

  async function handleAnalyze() {
    if (!selectedAnimalId) {
      setError(
        "Please select an Animal ID."
      );

      return;
    }

    if (!selectedFile) {
      setError(
        "Please select an animal image."
      );

      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setSuccessMessage("");
      setAiResult(null);

      /*
       * Actual backend flow:
       *
       * Animal ID
       *      +
       * Animal Image
       *      ↓
       * /api/ai/upload
       *      ↓
       * YOLO
       *      ↓
       * CNN
       *      ↓
       * XGBoost / production
       */

      const result =
        await uploadAIImage(
          selectedFile,
          selectedAnimalId
        );

      console.log(
        "DIGITAL TWIN AI RESPONSE:",
        result
      );

      setAiResult(result);

      setSuccessMessage(
        result?.message ||
          "Animal image uploaded and analyzed successfully."
      );
    } catch (err) {
      console.error(
        "AI analysis error:",
        err
      );

      if (
        err?.status === 401 ||
        err?.isUnauthorized
      ) {
        setError(
          "Your login session has expired. Please login again."
        );
      } else {
        setError(
          err?.message ||
            "AI analysis failed."
        );
      }

      setAiResult(null);
    } finally {
      setAnalyzing(false);
    }
  }

  // ==========================================================
  // CLEANUP PREVIEW
  // ==========================================================

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl
        );
      }
    };
  }, [previewUrl]);

  // ==========================================================
  // RESULT VALUES
  // ==========================================================

  const detectedSpecies =
    getDetectedSpecies(
      aiResult
    );

  const detectionCount =
    getDetectionCount(
      aiResult
    );

  const yoloConfidence =
    getDetectionConfidence(
      aiResult
    );

  const cnnClassification =
    getCNNClassification(
      aiResult
    );

  const cnnConfidence =
    getCNNConfidence(
      aiResult
    );

  const cnnPredictions =
    getTopCNNPredictions(
      aiResult
    );

  const health =
    getHealth(aiResult);

  const behaviour =
    getBehaviour(aiResult);

  const activity =
    getActivity(aiResult);

  const yoloStatus =
    aiResult?.analysis?.yolo
      ?.status ||
    null;

  const cnnStatus =
    aiResult?.analysis?.cnn
      ?.status ||
    null;

  const xgboostStatus =
    aiResult?.analysis?.xgboost
      ?.status ||
    aiResult?.predictions
      ?.status ||
    null;

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
      {/* ====================================================
          HEADER
      ==================================================== */}

      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            mb: 0.5,
          }}
        >
          Digital Twin
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          AI-powered livestock identity,
          health and farm intelligence
        </Typography>
      </Box>

      {/* ====================================================
          ERROR
      ==================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>
      )}

      {/* ====================================================
          SUCCESS
      ==================================================== */}

      {successMessage && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
          }}
          onClose={() =>
            setSuccessMessage("")
          }
        >
          {successMessage}
        </Alert>
      )}

      {/* ====================================================
          AI LIVESTOCK ANALYSIS
      ==================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 0.5,
            }}
          >
            AI Livestock Analysis
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            Upload an animal image or
            capture one using your camera.
          </Typography>

          <Grid
            container
            spacing={3}
          >
            {/* ==================================================
                LEFT
            ================================================== */}

            <Grid
              item
              xs={12}
              md={6}
            >
              {/* Animal image */}

              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{
                  mb: 1,
                }}
              >
                Animal Image
              </Typography>

              <Button
                component="label"
                variant="outlined"
                fullWidth
                sx={{
                  mb: 2,
                  py: 1.4,
                  textTransform:
                    "none",
                }}
              >
                Upload Animal Image

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={
                    handleFileChange
                  }
                />
              </Button>

              {selectedFile && (
                <Box
                  sx={{
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      wordBreak:
                        "break-word",
                    }}
                  >
                    {selectedFile.name}
                  </Typography>
                </Box>
              )}

              {/* ==================================================
                  LINK EXISTING ANIMAL
              ================================================== */}

              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{
                  mb: 1,
                }}
              >
                Link to existing animal
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1.5,
                }}
              >
                YOLO identifies the species.
                It does not automatically
                know the exact database animal.
              </Typography>

              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{
                  mb: 1,
                }}
              >
                Select animal record
              </Typography>

              {loadingAnimals ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems:
                      "center",
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

                    setAiResult(
                      null
                    );

                    setError("");
                    setSuccessMessage(
                      ""
                    );
                  }}
                  sx={{
                    mb: 3,
                  }}
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
                        id === "" ||
                        id === null ||
                        id === undefined
                      ) {
                        return null;
                      }

                      return (
                        <MenuItem
                          key={String(id)}
                          value={String(id)}
                        >
                          {String(id)}
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
              )}

              {/* Selected animal */}

              {selectedAnimal && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor:
                      "rgba(0,0,0,0.03)",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Selected Animal
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    {getAnimalId(
                      selectedAnimal
                    )}
                  </Typography>

                  {getAnimalTag(
                    selectedAnimal
                  ) && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Tag:{" "}
                      {getAnimalTag(
                        selectedAnimal
                      )}
                    </Typography>
                  )}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Species:{" "}
                    {getAnimalType(
                      selectedAnimal
                    )}
                  </Typography>
                </Box>
              )}

              {/* Analyze */}

              <Button
                variant="contained"
                fullWidth
                disabled={
                  !selectedFile ||
                  !selectedAnimalId ||
                  analyzing
                }
                onClick={
                  handleAnalyze
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

                    Analysing with AI...
                  </>
                ) : (
                  "Analyse Image"
                )}
              </Button>
            </Grid>

            {/* ==================================================
                RIGHT — IMAGE
            ================================================== */}

            <Grid
              item
              xs={12}
              md={6}
            >
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{
                  mb: 1,
                }}
              >
                Preview
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  minHeight: 320,
                  borderRadius: 2,
                  border:
                    "1px dashed rgba(0,0,0,0.25)",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  overflow: "hidden",
                  backgroundColor:
                    "rgba(0,0,0,0.02)",
                }}
              >
                {previewUrl ? (
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Uploaded animal"
                    sx={{
                      width: "100%",
                      maxHeight: 450,
                      objectFit:
                        "contain",
                    }}
                  />
                ) : (
                  <Typography
                    color="text.secondary"
                  >
                    Upload an animal image
                    to preview it here.
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ====================================================
          AI ANIMAL IDENTIFICATION
      ==================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 0.5,
            }}
          >
            AI Animal Identification
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            YOLO detection result
          </Typography>

          {!aiResult ? (
            <Typography
              color="text.secondary"
            >
              Upload and analyse an animal
              image to see the YOLO result.
            </Typography>
          ) : (
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      YOLO
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        mt: 1,
                      }}
                    >
                      {yoloStatus ||
                        "Complete"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
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
                      {detectedSpecies ||
                        "No animal detected"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Confidence
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        mt: 1,
                      }}
                    >
                      {formatConfidence(
                        yoloConfidence
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Animals Detected
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        mt: 1,
                      }}
                    >
                      {detectionCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* ====================================================
          HEALTH & DISEASE
      ==================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 0.5,
            }}
          >
            Health & Disease Analysis
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            CNN image classification
          </Typography>

          {!aiResult ? (
            <Typography
              color="text.secondary"
            >
              CNN health classification
              will appear after image analysis.
            </Typography>
          ) : (
            <>
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                >
                  <Card
                    variant="outlined"
                  >
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        CNN
                      </Typography>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          mt: 1,
                        }}
                      >
                        {cnnStatus ||
                          "Complete"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                >
                  <Card
                    variant="outlined"
                  >
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Animal Health
                      </Typography>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          mt: 1,
                        }}
                      >
                        {cnnClassification
                          ? formatSpecies(
                              cnnClassification
                            )
                          : health}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
                        }}
                      >
                        {formatConfidence(
                          cnnConfidence
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* CNN top predictions */}

              {cnnPredictions.length >
                0 && (
                <Box
                  sx={{
                    mt: 3,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{
                      mb: 1.5,
                    }}
                  >
                    Top CNN predictions
                  </Typography>

                  {cnnPredictions
                    .slice(0, 5)
                    .map(
                      (
                        prediction,
                        index
                      ) => {
                        const label =
                          prediction?.class ||
                          prediction?.label ||
                          prediction?.prediction ||
                          prediction?.name ||
                          "Unknown";

                        const confidence =
                          prediction?.confidence ??
                          prediction?.probability ??
                          prediction?.score;

                        return (
                          <Box
                            key={`${label}-${index}`}
                            sx={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "center",
                              py: 1,
                              borderBottom:
                                "1px solid rgba(0,0,0,0.08)",
                            }}
                          >
                            <Typography>
                              #{index + 1}{" "}
                              {formatSpecies(
                                label
                              )}
                            </Typography>

                            <Typography
                              fontWeight={
                                600
                              }
                            >
                              {formatConfidence(
                                confidence
                              )}
                            </Typography>
                          </Box>
                        );
                      }
                    )}
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ====================================================
          GROWTH & WEIGHT
      ==================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 0.5,
            }}
          >
            Growth & Weight
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Species-specific farm intelligence
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 2,
            }}
          >
            Growth and weight tracking can
            be used to monitor animal
            development.
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            Production predictions should
            use the applicable real ML model
            and actual animal/farm data.
          </Typography>
        </CardContent>
      </Card>

      {/* ====================================================
          AI FARM ANALYSIS
      ==================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 0.5,
            }}
          >
            AI Farm Analysis
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            Automated insights from animal
            monitoring.
          </Typography>

          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              md={4}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  mb: 1,
                }}
              >
                Behaviour
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {aiResult
                  ? behaviour
                  : "Upload an image to generate AI farm insights."}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  mb: 1,
                }}
              >
                Health
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {aiResult
                  ? health
                  : "Health analysis will appear after AI detection."}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  mb: 1,
                }}
              >
                Activity
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {aiResult
                  ? activity
                  : "Activity analysis will appear after AI detection."}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ====================================================
          DIGITAL TWIN STATUS
      ==================================================== */}

      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 2,
            }}
          >
            Digital Twin Status
          </Typography>

          <Divider
            sx={{
              mb: 2,
            }}
          />

          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Animal Image
              </Typography>

              <Typography
                fontWeight={600}
              >
                {selectedFile
                  ? "Complete"
                  : "Pending"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                YOLO Animal Detection
              </Typography>

              <Typography
                fontWeight={600}
              >
                {yoloStatus
                  ? "Complete"
                  : "Pending"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Species Identification
              </Typography>

              <Typography
                fontWeight={600}
              >
                {detectedSpecies
                  ? "Complete"
                  : "Pending"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                CNN Health Analysis
              </Typography>

              <Typography
                fontWeight={600}
              >
                {cnnStatus
                  ? "Complete"
                  : "Pending"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Animal Profile
              </Typography>

              <Typography
                fontWeight={600}
              >
                {selectedAnimal
                  ? "Complete"
                  : "Pending"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Species-specific Production
              </Typography>

              <Typography
                fontWeight={600}
              >
                {xgboostStatus ===
                "success"
                  ? "Complete"
                  : xgboostStatus
                  ? "Complete"
                  : "Pending"}
              </Typography>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor:
                "rgba(0,0,0,0.03)",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              <strong>
                How PashuSense works:
              </strong>{" "}
              the uploaded/captured image
              is sent to the real AI backend.
              YOLO identifies livestock species
              and confidence. CNN performs
              species-specific health
              classification. If CNN confidence
              is low, the result should be
              treated as low-confidence rather
              than a diagnosis. Farm records
              provide remaining Digital Twin
              information such as weight,
              vaccination, production and
              growth.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}