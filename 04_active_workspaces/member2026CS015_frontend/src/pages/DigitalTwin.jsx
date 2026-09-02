// ============================================================
// src/pages/DigitalTwin.jsx
// Apollo Agriverse - PashuSense
// Digital Twin + AI Livestock Analysis + Three.js
// ============================================================

import React, {
  useEffect,
  useMemo,
  useRef,
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

import * as THREE from "three";

import {
  getAnimals,
  uploadAIImage,
} from "../api/backend";

// ============================================================
// HELPERS
// ============================================================

function formatSpecies(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value)
    .trim()
    .replace(/[_-]+/g, " ");

  if (!text) return "";

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

function getAnimalId(animal) {
  return (
    animal?.animal_id ??
    animal?.id ??
    animal?.animalId ??
    ""
  );
}

function getAnimalType(animal) {
  if (!animal) return "Animal";

  return formatSpecies(
    animal?.animal_type ||
      animal?.species ||
      animal?.type ||
      animal?.animal_species ||
      "Animal"
  );
}

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
// AI RESULT HELPERS
// ============================================================

function getDetectedSpecies(result) {
  const analysis = result?.analysis;

  if (!analysis) return null;

  const directSpecies =
    analysis?.detected_species;

  if (
    directSpecies &&
    String(directSpecies).trim()
  ) {
    return formatSpecies(directSpecies);
  }

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
        .map((item) =>
          Number(item?.confidence)
        )
        .filter((value) =>
          Number.isFinite(value)
        );

    if (values.length > 0) {
      return Math.max(...values);
    }
  }

  return null;
}

function getDetectionCount(result) {
  const count =
    result?.analysis?.yolo?.count;

  if (typeof count === "number") {
    return count;
  }

  const totalAnimals =
    result?.analysis?.yolo?.total_animals;

  if (typeof totalAnimals === "number") {
    return totalAnimals;
  }

  const detections =
    result?.analysis?.yolo?.detections;

  if (Array.isArray(detections)) {
    return detections.length;
  }

  return 0;
}

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

function getCNNConfidence(result) {
  const cnn =
    result?.analysis?.cnn;

  const value =
    cnn?.confidence ??
    cnn?.probability ??
    cnn?.score;

  if (typeof value === "number") {
    return value;
  }

  return null;
}

function getTopCNNPredictions(result) {
  const cnn =
    result?.analysis?.cnn;

  const predictions =
    cnn?.top_predictions ||
    cnn?.predictions ||
    cnn?.top_classes;

  return Array.isArray(predictions)
    ? predictions
    : [];
}

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

  if (typeof health === "string") {
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

  if (typeof value === "object") {
    return (
      value?.prediction ||
      value?.result ||
      value?.status ||
      "Not available"
    );
  }

  return String(value);
}

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

  if (typeof value === "object") {
    return (
      value?.prediction ||
      value?.result ||
      value?.status ||
      "Not available"
    );
  }

  return String(value);
}

function formatConfidence(value) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return "—";
  }

  const number = Number(value);

  const percentage =
    number <= 1
      ? number * 100
      : number;

  return `${percentage.toFixed(1)}%`;
}

// ============================================================
// THREE.JS DIGITAL TWIN
// ============================================================

function DigitalTwin3D({
  species,
  mode,
  animalId,
}) {
  const mountRef = useRef(null);

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);

  const animalsRef = useRef([]);
  const targetRef = useRef(
    new THREE.Vector3(0, 0, 5)
  );

  const raycasterRef =
    useRef(new THREE.Raycaster());

  const mouseRef =
    useRef(new THREE.Vector2());

  const selectedRef =
    useRef(null);

  // ==========================================================
  // MATERIALS
  // ==========================================================

  const createMaterials = () => {
    return {
      wool: new THREE.MeshStandardMaterial({
        color: 0xf3f3ee,
        roughness: 0.95,
      }),

      woolDark: new THREE.MeshStandardMaterial({
        color: 0xd9d9d3,
        roughness: 1,
      }),

      face: new THREE.MeshStandardMaterial({
        color: 0x7b5b4a,
        roughness: 0.8,
      }),

      faceDark: new THREE.MeshStandardMaterial({
        color: 0x4b342a,
        roughness: 0.85,
      }),

      black: new THREE.MeshStandardMaterial({
        color: 0x101010,
        roughness: 0.5,
      }),

      brown: new THREE.MeshStandardMaterial({
        color: 0x8a5a35,
        roughness: 0.8,
      }),

      cowWhite: new THREE.MeshStandardMaterial({
        color: 0xf4f4f0,
        roughness: 0.9,
      }),

      cowBlack: new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.85,
      }),

      pink: new THREE.MeshStandardMaterial({
        color: 0xd58d8d,
        roughness: 0.8,
      }),

      chicken: new THREE.MeshStandardMaterial({
        color: 0xe8e0c7,
        roughness: 0.9,
      }),

      red: new THREE.MeshStandardMaterial({
        color: 0xc73535,
        roughness: 0.7,
      }),

      orange: new THREE.MeshStandardMaterial({
        color: 0xe39b35,
        roughness: 0.75,
      }),

      ground: new THREE.MeshStandardMaterial({
        color: 0x31433c,
        roughness: 1,
      }),

      fence: new THREE.MeshStandardMaterial({
        color: 0x71806f,
        roughness: 0.9,
      }),
    };
  };

  // ==========================================================
  // WOOL PUFF
  // ==========================================================

  const addWoolPuff = (
    parent,
    materials,
    x,
    y,
    z,
    scale = 1
  ) => {
    const puff =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.23 * scale,
          12,
          10
        ),
        materials.wool
      );

    puff.position.set(
      x,
      y,
      z
    );

    puff.scale.set(
      1,
      0.85,
      1.15
    );

    puff.castShadow = true;

    parent.add(puff);

    return puff;
  };

  // ==========================================================
  // SHEEP / RUMINANT
  // ==========================================================

  const createRuminant = (id, materials) => {
    const group =
      new THREE.Group();

    group.userData.id = id;
    group.userData.type = "ruminant";
    group.userData.phase =
      Math.random() *
      Math.PI *
      2;

    // ---------------- BODY ----------------

    const bodyGroup =
      new THREE.Group();

    const body =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.95,
          20,
          16
        ),
        materials.wool
      );

    body.scale.set(
      1.05,
      0.85,
      1.45
    );

    body.castShadow = true;

    bodyGroup.add(body);

    // Wool texture made from multiple rounded forms
    addWoolPuff(
      bodyGroup,
      materials,
      0.55,
      0.35,
      0.55,
      1.1
    );

    addWoolPuff(
      bodyGroup,
      materials,
      -0.55,
      0.35,
      0.45,
      1.05
    );

    addWoolPuff(
      bodyGroup,
      materials,
      0.55,
      0.2,
      -0.35,
      1.1
    );

    addWoolPuff(
      bodyGroup,
      materials,
      -0.5,
      0.2,
      -0.45,
      1.05
    );

    addWoolPuff(
      bodyGroup,
      materials,
      0,
      0.65,
      0,
      1.15
    );

    bodyGroup.position.y = 1.35;

    group.add(bodyGroup);

    // ---------------- NECK ----------------

    const neck =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.38,
          16,
          12
        ),
        materials.wool
      );

    neck.scale.set(
      0.9,
      1.35,
      0.85
    );

    neck.position.set(
      0,
      1.45,
      0.85
    );

    neck.castShadow = true;

    group.add(neck);

    // ---------------- HEAD ----------------

    const headGroup =
      new THREE.Group();

    headGroup.position.set(
      0,
      1.85,
      1.15
    );

    const head =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.38,
          18,
          14
        ),
        materials.face
      );

    head.scale.set(
      0.8,
      1,
      1.15
    );

    head.castShadow = true;

    headGroup.add(head);

    // Wool cap
    const cap =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.39,
          16,
          12
        ),
        materials.wool
      );

    cap.scale.set(
      1,
      0.5,
      0.95
    );

    cap.position.set(
      0,
      0.25,
      -0.05
    );

    headGroup.add(cap);

    // ---------------- EARS ----------------

    const earGeo =
      new THREE.SphereGeometry(
        0.16,
        12,
        8
      );

    const earL =
      new THREE.Mesh(
        earGeo,
        materials.faceDark
      );

    earL.scale.set(
      1.3,
      0.45,
      0.7
    );

    earL.position.set(
      0.3,
      0.1,
      0
    );

    earL.rotation.z =
      -Math.PI / 5;

    const earR =
      new THREE.Mesh(
        earGeo,
        materials.faceDark
      );

    earR.scale.set(
      1.3,
      0.45,
      0.7
    );

    earR.position.set(
      -0.3,
      0.1,
      0
    );

    earR.rotation.z =
      Math.PI / 5;

    headGroup.add(
      earL,
      earR
    );

    // ---------------- EYES ----------------

    const eyeGeo =
      new THREE.SphereGeometry(
        0.055,
        10,
        8
      );

    const eyeL =
      new THREE.Mesh(
        eyeGeo,
        materials.black
      );

    eyeL.position.set(
      0.14,
      0.08,
      0.37
    );

    const eyeR =
      new THREE.Mesh(
        eyeGeo,
        materials.black
      );

    eyeR.position.set(
      -0.14,
      0.08,
      0.37
    );

    headGroup.add(
      eyeL,
      eyeR
    );

    group.add(headGroup);

    // ---------------- LEGS ----------------

    const legs = [];

    const legPositions = [
      [0.48, 0.55],
      [-0.48, 0.55],
      [0.48, -0.55],
      [-0.48, -0.55],
    ];

    legPositions.forEach(
      ([x, z]) => {
        const legGroup =
          new THREE.Group();

        legGroup.position.set(
          x,
          0.85,
          z
        );

        const upper =
          new THREE.Mesh(
            new THREE.CylinderGeometry(
              0.09,
              0.075,
              0.65,
              10
            ),
            materials.faceDark
          );

        upper.position.y =
          -0.28;

        upper.castShadow = true;

        legGroup.add(upper);

        const hoof =
          new THREE.Mesh(
            new THREE.SphereGeometry(
              0.1,
              10,
              8
            ),
            materials.black
          );

        hoof.scale.set(
          0.9,
          0.55,
          1.15
        );

        hoof.position.set(
          0,
          -0.63,
          0.04
        );

        hoof.castShadow = true;

        legGroup.add(hoof);

        group.add(legGroup);

        legs.push(legGroup);
      }
    );

    // ---------------- TAIL ----------------

    const tail =
      new THREE.Mesh(
        new THREE.ConeGeometry(
          0.1,
          0.4,
          10
        ),
        materials.wool
      );

    tail.rotation.x =
      Math.PI / 2;

    tail.position.set(
      0,
      1.55,
      -1.35
    );

    group.add(tail);

    group.userData = {
      ...group.userData,
      head: headGroup,
      body: bodyGroup,
      legs,
      tail,
    };

    return group;
  };

  // ============================================================
  // COW
  // ============================================================

  const createDairy = (id, materials) => {
    const group =
      new THREE.Group();

    group.userData.id = id;
    group.userData.type = "dairy";
    group.userData.phase =
      Math.random() *
      Math.PI *
      2;

    // ---------------- BODY ----------------

    const bodyGroup =
      new THREE.Group();

    const body =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          1,
          20,
          16
        ),
        materials.cowWhite
      );

    body.scale.set(
      1.05,
      0.82,
      1.55
    );

    body.castShadow = true;

    bodyGroup.add(body);

    // Black patches
    const patch1 =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.3,
          12,
          10
        ),
        materials.cowBlack
      );

    patch1.scale.set(
      1,
      0.55,
      0.35
    );

    patch1.position.set(
      0.65,
      0.25,
      0.35
    );

    bodyGroup.add(patch1);

    const patch2 =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.28,
          12,
          10
        ),
        materials.cowBlack
      );

    patch2.scale.set(
      1,
      0.55,
      0.4
    );

    patch2.position.set(
      -0.65,
      0.15,
      -0.4
    );

    bodyGroup.add(patch2);

    bodyGroup.position.y =
      1.45;

    group.add(bodyGroup);

    // ---------------- NECK ----------------

    const neck =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.45,
          16,
          12
        ),
        materials.cowWhite
      );

    neck.scale.set(
      0.95,
      1.25,
      0.9
    );

    neck.position.set(
      0,
      1.5,
      1.15
    );

    group.add(neck);

    // ---------------- HEAD ----------------

    const headGroup =
      new THREE.Group();

    headGroup.position.set(
      0,
      1.9,
      1.5
    );

    const head =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.42,
          18,
          14
        ),
        materials.cowWhite
      );

    head.scale.set(
      0.9,
      0.9,
      1.15
    );

    headGroup.add(head);

    // muzzle
    const muzzle =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.25,
          14,
          10
        ),
        materials.pink
      );

    muzzle.scale.set(
      1.15,
      0.7,
      0.75
    );

    muzzle.position.z =
      0.35;

    headGroup.add(muzzle);

    // ears
    const earGeo =
      new THREE.SphereGeometry(
        0.18,
        12,
        8
      );

    const earL =
      new THREE.Mesh(
        earGeo,
        materials.cowWhite
      );

    earL.scale.set(
      1.3,
      0.4,
      0.75
    );

    earL.position.set(
      0.35,
      0.12,
      0
    );

    const earR =
      new THREE.Mesh(
        earGeo,
        materials.cowWhite
      );

    earR.scale.set(
      1.3,
      0.4,
      0.75
    );

    earR.position.set(
      -0.35,
      0.12,
      0
    );

    headGroup.add(
      earL,
      earR
    );

    // horns
    const hornGeo =
      new THREE.ConeGeometry(
        0.06,
        0.3,
        10
      );

    const hornL =
      new THREE.Mesh(
        hornGeo,
        materials.face
      );

    hornL.position.set(
      0.22,
      0.35,
      -0.05
    );

    hornL.rotation.z =
      -Math.PI / 5;

    const hornR =
      new THREE.Mesh(
        hornGeo,
        materials.face
      );

    hornR.position.set(
      -0.22,
      0.35,
      -0.05
    );

    hornR.rotation.z =
      Math.PI / 5;

    headGroup.add(
      hornL,
      hornR
    );

    // eyes
    const eyeGeo =
      new THREE.SphereGeometry(
        0.055,
        10,
        8
      );

    const eyeL =
      new THREE.Mesh(
        eyeGeo,
        materials.black
      );

    eyeL.position.set(
      0.16,
      0.08,
      0.36
    );

    const eyeR =
      new THREE.Mesh(
        eyeGeo,
        materials.black
      );

    eyeR.position.set(
      -0.16,
      0.08,
      0.36
    );

    headGroup.add(
      eyeL,
      eyeR
    );

    group.add(headGroup);

    // ---------------- LEGS ----------------

    const legs = [];

    [
      [0.5, 0.65],
      [-0.5, 0.65],
      [0.5, -0.65],
      [-0.5, -0.65],
    ].forEach(([x, z]) => {
      const legGroup =
        new THREE.Group();

      legGroup.position.set(
        x,
        0.9,
        z
      );

      const leg =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.085,
            0.065,
            0.95,
            10
          ),
          materials.face
        );

      leg.position.y =
        -0.45;

      leg.castShadow = true;

      legGroup.add(leg);

      const hoof =
        new THREE.Mesh(
          new THREE.SphereGeometry(
            0.1,
            10,
            8
          ),
          materials.black
        );

      hoof.scale.set(
        0.9,
        0.5,
        1.1
      );

      hoof.position.y =
        -0.92;

      legGroup.add(hoof);

      group.add(legGroup);

      legs.push(legGroup);
    });

    // ---------------- TAIL ----------------

    const tail =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.035,
          0.025,
          0.75,
          8
        ),
        materials.face
      );

    tail.position.set(
      0,
      1.55,
      -1.65
    );

    tail.rotation.x =
      Math.PI / 3;

    group.add(tail);

    group.userData = {
      ...group.userData,
      head: headGroup,
      body: bodyGroup,
      legs,
      tail,
    };

    return group;
  };

  // ============================================================
  // CHICKEN
  // ============================================================

  const createPoultry = (id, materials) => {
    const group =
      new THREE.Group();

    group.userData.id = id;
    group.userData.type = "poultry";
    group.userData.phase =
      Math.random() *
      Math.PI *
      2;

    // ---------------- BODY ----------------

    const body =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.55,
          16,
          14
        ),
        materials.chicken
      );

    body.scale.set(
      0.9,
      1,
      1.2
    );

    body.position.y =
      0.8;

    body.castShadow = true;

    group.add(body);

    // ---------------- HEAD ----------------

    const headGroup =
      new THREE.Group();

    headGroup.position.set(
      0,
      1.35,
      0.45
    );

    const head =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.3,
          16,
          12
        ),
        materials.chicken
      );

    head.castShadow = true;

    headGroup.add(head);

    // beak
    const beak =
      new THREE.Mesh(
        new THREE.ConeGeometry(
          0.09,
          0.3,
          8
        ),
        materials.orange
      );

    beak.rotation.x =
      Math.PI / 2;

    beak.position.z =
      0.32;

    headGroup.add(beak);

    // comb
    const comb =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.12,
          10,
          8
        ),
        materials.red
      );

    comb.scale.set(
      0.65,
      1.2,
      0.7
    );

    comb.position.y =
      0.28;

    headGroup.add(comb);

    // eyes
    const eye =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.04,
          8,
          8
        ),
        materials.black
      );

    eye.position.set(
      0.12,
      0.04,
      0.27
    );

    const eye2 =
      eye.clone();

    eye2.position.x =
      -0.12;

    headGroup.add(
      eye,
      eye2
    );

    group.add(headGroup);

    // ---------------- WINGS ----------------

    const wings = [];

    [-1, 1].forEach((side) => {
      const wing =
        new THREE.Mesh(
          new THREE.SphereGeometry(
            0.3,
            14,
            10
          ),
          materials.chicken
        );

      wing.scale.set(
        0.25,
        0.8,
        1.1
      );

      wing.position.set(
        side * 0.42,
        0.85,
        0
      );

      wing.rotation.z =
        side * 0.25;

      wing.castShadow = true;

      group.add(wing);

      wings.push(wing);
    });

    // ---------------- LEGS ----------------

    const legs = [];

    [-0.16, 0.16].forEach(
      (x) => {
        const leg =
          new THREE.Mesh(
            new THREE.CylinderGeometry(
              0.035,
              0.025,
              0.45,
              8
            ),
            materials.orange
          );

        leg.position.set(
          x,
          0.3,
          0.05
        );

        group.add(leg);

        legs.push(leg);
      }
    );

    // ---------------- TAIL FEATHERS ----------------

    for (let i = -1; i <= 1; i++) {
      const feather =
        new THREE.Mesh(
          new THREE.SphereGeometry(
            0.16,
            10,
            8
          ),
          materials.chicken
        );

      feather.scale.set(
        0.45,
        0.75,
        1
      );

      feather.position.set(
        i * 0.12,
        0.95,
        -0.55
      );

      feather.rotation.x =
        -0.5;

      group.add(feather);
    }

    group.userData = {
      ...group.userData,
      head: headGroup,
      body,
      legs,
      wings,
    };

    return group;
  };

  // ============================================================
  // SCENE SETUP
  // ============================================================

  useEffect(() => {
    const mount =
      mountRef.current;

    if (!mount) return;

    const scene =
      new THREE.Scene();

    scene.background =
      new THREE.Color(
        0x0b1220
      );

    sceneRef.current = scene;

    const camera =
      new THREE.PerspectiveCamera(
        45,
        mount.clientWidth /
          mount.clientHeight,
        0.1,
        200
      );

    camera.position.set(
      7,
      4.5,
      11
    );

    camera.lookAt(
      0,
      1,
      4
    );

    cameraRef.current =
      camera;

    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

    renderer.setSize(
      mount.clientWidth,
      mount.clientHeight
    );

    renderer.shadowMap.enabled =
      true;

    renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    mount.appendChild(
      renderer.domElement
    );

    rendererRef.current =
      renderer;

    // ========================================================
    // LIGHTS
    // ========================================================

    const ambient =
      new THREE.HemisphereLight(
        0xbfd4e8,
        0x26352d,
        2.1
      );

    scene.add(ambient);

    const sun =
      new THREE.DirectionalLight(
        0xffffff,
        3
      );

    sun.position.set(
      8,
      14,
      8
    );

    sun.castShadow = true;

    sun.shadow.mapSize.width =
      2048;

    sun.shadow.mapSize.height =
      2048;

    sun.shadow.camera.left =
      -30;

    sun.shadow.camera.right =
      30;

    sun.shadow.camera.top =
      30;

    sun.shadow.camera.bottom =
      -30;

    scene.add(sun);

    // ========================================================
    // GROUND
    // ========================================================

    const materials =
      createMaterials();

    const ground =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          90,
          90
        ),
        materials.ground
      );

    ground.rotation.x =
      -Math.PI / 2;

    ground.position.y =
      -0.01;

    ground.receiveShadow = true;

    scene.add(ground);

    // ========================================================
    // GRID
    // ========================================================

    const grid =
      new THREE.GridHelper(
        70,
        35,
        0x52685f,
        0x263d35
      );

    grid.position.y =
      0.01;

    grid.material.opacity =
      0.38;

    grid.material.transparent =
      true;

    scene.add(grid);

    // ========================================================
    // FARM STRUCTURE
    // ========================================================

    const barn =
      new THREE.Group();

    const barnBody =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          5,
          2.7,
          5
        ),
        new THREE.MeshStandardMaterial({
          color: 0x354154,
          roughness: 0.9,
        })
      );

    barnBody.position.set(
      0,
      1.35,
      -7
    );

    barnBody.castShadow = true;

    barn.add(barnBody);

    const roof =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          5.5,
          0.25,
          5.5
        ),
        new THREE.MeshStandardMaterial({
          color: 0x4c5b6f,
          roughness: 0.8,
        })
      );

    roof.position.set(
      0,
      2.78,
      -7
    );

    roof.castShadow = true;

    barn.add(roof);

    scene.add(barn);

    // ========================================================
    // FENCE
    // ========================================================

    const fenceGroup =
      new THREE.Group();

    const fenceMat =
      materials.fence;

    for (
      let x = -18;
      x <= 18;
      x += 3
    ) {
      const post =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.06,
            0.06,
            1.3,
            8
          ),
          fenceMat
        );

      post.position.set(
        x,
        0.65,
        -16
      );

      fenceGroup.add(post);
    }

    const fenceRail =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          36,
          0.08,
          0.08
        ),
        fenceMat
      );

    fenceRail.position.set(
      0,
      0.9,
      -16
    );

    fenceGroup.add(fenceRail);

    scene.add(fenceGroup);

    // ========================================================
    // ANIMALS
    // ========================================================

    const animalMeshes = [];

    const count =
      mode === "individual"
        ? 1
        : species === "poultry"
        ? 18
        : 10;

    for (
      let i = 0;
      i < count;
      i++
    ) {
      let animal;

      if (species === "dairy") {
        animal =
          createDairy(
            i + 1,
            materials
          );
      } else if (
        species === "poultry"
      ) {
        animal =
          createPoultry(
            i + 1,
            materials
          );
      } else {
        animal =
          createRuminant(
            i + 1,
            materials
          );
      }

      if (mode === "individual") {
        animal.position.set(
          0,
          0,
          4.5
        );
      } else {
        const angle =
          Math.random() *
          Math.PI *
          2;

        const radius =
          species === "poultry"
            ? 7 +
              Math.random() * 8
            : 5 +
              Math.random() * 9;

        animal.position.set(
          Math.cos(angle) *
            radius,
          0,
          Math.sin(angle) *
            radius +
            4
        );
      }

      animal.scale.setScalar(
        species === "poultry"
          ? 1.05
          : 1
      );

      animal.castShadow =
        true;

      animalMeshes.push({
        mesh: animal,
        velocity:
          new THREE.Vector3(
            (Math.random() -
              0.5) *
              1.5,
            0,
            (Math.random() -
              0.5) *
              1.5
          ),
      });

      scene.add(animal);
    }

    animalsRef.current =
      animalMeshes;

    // ========================================================
    // TARGET INDICATOR
    // ========================================================

    const indicator =
      new THREE.Mesh(
        new THREE.RingGeometry(
          0.45,
          0.62,
          32
        ),
        new THREE.MeshBasicMaterial({
          color: 0x22c55e,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
        })
      );

    indicator.rotation.x =
      -Math.PI / 2;

    indicator.position.set(
      0,
      0.04,
      5
    );

    indicator.visible =
      mode === "individual";

    scene.add(indicator);

    // ========================================================
    // ANIMATION
    // ========================================================

    const clock =
      new THREE.Clock();

    const animate = () => {
      animationRef.current =
        requestAnimationFrame(
          animate
        );

      const delta =
        Math.min(
          clock.getDelta(),
          0.05
        );

      const time =
        clock.elapsedTime;

      // -------------------------
      // Individual
      // -------------------------

      if (
        mode === "individual" &&
        animalMeshes.length
      ) {
        const animal =
          animalMeshes[0].mesh;

        const rig =
          animal.userData;

        const direction =
          new THREE.Vector3()
            .subVectors(
              targetRef.current,
              animal.position
            );

        const distance =
          direction.length();

        let speed = 0;

        if (distance > 0.12) {
          direction.normalize();

          speed =
            Math.min(
              distance * 1.8,
              1.6
            );

          animal.position.addScaledVector(
            direction,
            speed * delta
          );

          animal.rotation.y =
            Math.atan2(
              direction.x,
              direction.z
            );
        }

        if (rig.phase !== undefined) {
          rig.phase +=
            delta *
            speed *
            5;
        }

        if (
          speed > 0.08 &&
          rig.legs
        ) {
          rig.legs.forEach(
            (leg, index) => {
              const offset =
                index % 2 === 0
                  ? 0
                  : Math.PI;

              leg.rotation.x =
                Math.sin(
                  rig.phase +
                    offset
                ) * 0.35;
            }
          );
        }

        if (rig.head) {
          rig.head.rotation.x =
            Math.sin(
              time * 2
            ) * 0.05;
        }

        if (rig.tail) {
          rig.tail.rotation.z =
            Math.sin(
              time * 3
            ) * 0.15;
        }

        indicator.position.x =
          targetRef.current.x;

        indicator.position.z =
          targetRef.current.z;

        indicator.scale.setScalar(
          1 +
            Math.sin(
              time * 6
            ) *
              0.08
        );
      }

      // -------------------------
      // Flock
      // -------------------------

      if (
        mode === "flock"
      ) {
        animalMeshes.forEach(
          (item, index) => {
            const animal =
              item.mesh;

            const velocity =
              item.velocity;

            const rig =
              animal.userData;

            const speed =
              velocity.length();

            // Random gentle movement
            velocity.x +=
              (Math.random() -
                0.5) *
              0.08;

            velocity.z +=
              (Math.random() -
                0.5) *
              0.08;

            // Keep animals inside area
            const distance =
              Math.sqrt(
                animal.position.x *
                  animal.position.x +
                  animal.position.z *
                  animal.position.z
              );

            if (distance > 20) {
              velocity.add(
                new THREE.Vector3(
                  -animal.position.x,
                  0,
                  -animal.position.z
                ).normalize()
              );
            }

            velocity.clampLength(
              0.15,
              species ===
                "poultry"
                ? 1.8
                : 1.15
            );

            animal.position.addScaledVector(
              velocity,
              delta
            );

            if (
              speed > 0.05
            ) {
              animal.rotation.y =
                Math.atan2(
                  velocity.x,
                  velocity.z
                );
            }

            if (
              rig.phase !==
              undefined
            ) {
              rig.phase +=
                delta *
                speed *
                5;
            }

            if (
              rig.legs
            ) {
              rig.legs.forEach(
                (
                  leg,
                  legIndex
                ) => {
                  const offset =
                    legIndex %
                      2 ===
                    0
                      ? 0
                      : Math.PI;

                  leg.rotation.x =
                    Math.sin(
                      rig.phase +
                        offset
                    ) *
                    (species ===
                    "poultry"
                      ? 0.45
                      : 0.3);
                }
              );
            }

            if (
              species ===
                "poultry" &&
              rig.wings
            ) {
              rig.wings[0].rotation.z =
                Math.sin(
                  time * 2 +
                    index
                ) *
                0.08;

              rig.wings[1].rotation.z =
                -Math.sin(
                  time * 2 +
                    index
                ) *
                0.08;
            }

            if (
              rig.head
            ) {
              rig.head.rotation.x =
                Math.sin(
                  time * 2 +
                    index
                ) *
                0.05;
            }
          }
        );
      }

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    // ========================================================
    // CLICK TO MOVE INDIVIDUAL ANIMAL
    // ========================================================

    const handlePointerDown =
      (event) => {
        if (
          mode !==
          "individual"
        ) {
          return;
        }

        const rect =
          renderer.domElement.getBoundingClientRect();

        mouseRef.current.x =
          ((event.clientX -
            rect.left) /
            rect.width) *
            2 -
          1;

        mouseRef.current.y =
          -(
            (event.clientY -
              rect.top) /
            rect.height
          ) *
            2 +
          1;

        raycasterRef.current.setFromCamera(
          mouseRef.current,
          camera
        );

        const groundPoint =
          new THREE.Vector3();

        const ray =
          raycasterRef.current.ray;

        const plane =
          new THREE.Plane(
            new THREE.Vector3(
              0,
              1,
              0
            ),
            0
          );

        if (
          ray.intersectPlane(
            plane,
            groundPoint
          )
        ) {
          targetRef.current.copy(
            groundPoint
          );
        }
      };

    renderer.domElement.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    // ========================================================
    // RESIZE
    // ========================================================

    const handleResize =
      () => {
        if (!mount) return;

        const width =
          mount.clientWidth;

        const height =
          mount.clientHeight;

        camera.aspect =
          width / height;

        camera.updateProjectionMatrix();

        renderer.setSize(
          width,
          height
        );
      };

    window.addEventListener(
      "resize",
      handleResize
    );

    handleResize();

    // ========================================================
    // CLEANUP
    // ========================================================

    return () => {
      cancelAnimationFrame(
        animationRef.current
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      renderer.domElement.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      renderer.dispose();

      if (
        mount.contains(
          renderer.domElement
        )
      ) {
        mount.removeChild(
          renderer.domElement
        );
      }

      scene.traverse(
        (object) => {
          if (
            object.geometry
          ) {
            object.geometry.dispose();
          }

          if (
            object.material
          ) {
            if (
              Array.isArray(
                object.material
              )
            ) {
              object.material.forEach(
                (material) =>
                  material.dispose()
              );
            } else {
              object.material.dispose();
            }
          }
        }
      );
    };
  }, [
    species,
    mode,
  ]);

  // ==========================================================
  // UPDATE CAMERA
  // ==========================================================

  useEffect(() => {
    const camera =
      cameraRef.current;

    if (!camera) return;

    if (
      mode === "individual"
    ) {
      camera.position.set(
        7,
        4.5,
        11
      );

      camera.lookAt(
        0,
        1,
        4
      );
    } else {
      camera.position.set(
        0,
        18,
        22
      );

      camera.lookAt(
        0,
        0,
        2
      );
    }
  }, [mode]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: {
          xs: 420,
          md: 560,
        },
        overflow: "hidden",
        borderRadius: 2,
        background:
          "#0b1220",
      }}
    >
      <Box
        ref={mountRef}
        sx={{
          position: "absolute",
          inset: 0,
        }}
      />

      {/* =====================================================
          TOP LEFT DIGITAL TWIN LABEL
      ===================================================== */}

      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          px: 2,
          py: 1,
          borderRadius: 2,
          backgroundColor:
            "rgba(15,23,42,0.88)",
          color: "white",
          backdropFilter:
            "blur(8px)",
          pointerEvents: "none",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color:
              "rgba(255,255,255,0.65)",
          }}
        >
          PASHUSENSE DIGITAL TWIN
        </Typography>

        <Typography
          fontWeight={700}
        >
          {formatSpecies(
            species
          )}
        </Typography>
      </Box>

      {/* =====================================================
          ANIMAL TAG
      ===================================================== */}

      {mode ===
        "individual" && (
        <Box
          sx={{
            position: "absolute",
            top: 92,
            left: "50%",
            transform:
              "translateX(-50%)",
            px: 3,
            py: 1.1,
            borderRadius: 2,
            backgroundColor:
              "rgba(71,91,128,0.95)",
            color: "white",
            fontWeight: 700,
            fontSize: 18,
            pointerEvents: "none",
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.25)",
          }}
        >
          ANIMAL #{animalId || "1"}
        </Box>
      )}

      {/* =====================================================
          BOTTOM STATUS
      ===================================================== */}

      <Box
        sx={{
          position: "absolute",
          bottom: 14,
          left: 14,
          right: 14,
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 0.7,
            borderRadius: 1.5,
            backgroundColor:
              "rgba(15,23,42,0.82)",
            color: "white",
          }}
        >
          <Typography
            variant="caption"
          >
            MODE
          </Typography>

          <Typography
            variant="body2"
            fontWeight={700}
          >
            {mode ===
            "individual"
              ? "Individual Twin"
              : "Flock Simulation"}
          </Typography>
        </Box>

        {mode ===
          "individual" && (
          <Box
            sx={{
              px: 1.5,
              py: 0.7,
              borderRadius: 1.5,
              backgroundColor:
                "rgba(15,23,42,0.82)",
              color:
                "#6ee7b7",
            }}
          >
            <Typography
              variant="caption"
            >
              INTERACTION
            </Typography>

            <Typography
              variant="body2"
              fontWeight={700}
            >
              Click ground to move
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ============================================================
// MAIN COMPONENT
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

  const [
    twinSpecies,
    setTwinSpecies,
  ] = useState("ruminants");

  const [
    twinMode,
    setTwinMode,
  ] = useState("individual");

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

        if (
          list.length > 0
        ) {
          const firstId =
            getAnimalId(
              list[0]
            );

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

        if (!mounted) return;

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
          setLoadingAnimals(
            false
          );
        }
      }
    }

    loadAnimals();

    return () => {
      mounted = false;
    };
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
  // FILE
  // ==========================================================

  function handleFileChange(
    event
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

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
  // PREVIEW CLEANUP
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
  // AI VALUES
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
  // SPECIES SWITCH
  // ==========================================================

  function changeTwinSpecies(
    value
  ) {
    setTwinSpecies(value);
  }

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

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ mb: 0.5 }}
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
          sx={{ mb: 3 }}
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
          sx={{ mb: 3 }}
          onClose={() =>
            setSuccessMessage("")
          }
        >
          {successMessage}
        </Alert>
      )}

      {/* ====================================================
          3D DIGITAL TWIN
      ==================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 0.5 }}
          >
            3D Digital Twin
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Interactive livestock simulation
            connected to the PashuSense animal
            profile.
          </Typography>

          {/* ==================================================
              CONTROLS
          ================================================== */}

          <Grid
            container
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Grid
              item
              xs={12}
              md={4}
            >
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ mb: 1 }}
              >
                Species
              </Typography>

              <Select
                fullWidth
                size="small"
                value={twinSpecies}
                onChange={(event) =>
                  changeTwinSpecies(
                    event.target.value
                  )
                }
              >
                <MenuItem value="ruminants">
                  Sheep / Ruminants
                </MenuItem>

                <MenuItem value="dairy">
                  Dairy Cow
                </MenuItem>

                <MenuItem value="poultry">
                  Poultry
                </MenuItem>
              </Select>
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
            >
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ mb: 1 }}
              >
                Twin Mode
              </Typography>

              <Select
                fullWidth
                size="small"
                value={twinMode}
                onChange={(event) =>
                  setTwinMode(
                    event.target.value
                  )
                }
              >
                <MenuItem value="individual">
                  Individual Animal
                </MenuItem>

                <MenuItem value="flock">
                  Flock Simulation
                </MenuItem>
              </Select>
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
            >
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ mb: 1 }}
              >
                Linked Animal ID
              </Typography>

              <Typography
                sx={{
                  border:
                    "1px solid rgba(0,0,0,0.15)",
                  borderRadius: 1,
                  px: 1.5,
                  py: 1,
                  fontWeight: 700,
                }}
              >
                {selectedAnimalId ||
                  "Not selected"}
              </Typography>
            </Grid>
          </Grid>

          <DigitalTwin3D
            species={twinSpecies}
            mode={twinMode}
            animalId={
              selectedAnimalId
            }
          />
        </CardContent>
      </Card>

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
            sx={{ mb: 0.5 }}
          >
            AI Livestock Analysis
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Upload an animal image and link it
            to an existing Animal ID.
          </Typography>

          <Grid
            container
            spacing={3}
          >
            {/* LEFT */}

            <Grid
              item
              xs={12}
              md={6}
            >
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ mb: 1 }}
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    wordBreak:
                      "break-word",
                  }}
                >
                  {selectedFile.name}
                </Typography>
              )}

              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ mb: 1 }}
              >
                Select Animal ID
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
                  >
                    Animal #
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
                      sx={{ mr: 1 }}
                    />

                    Analysing with AI...
                  </>
                ) : (
                  "Analyse Image"
                )}
              </Button>
            </Grid>

            {/* RIGHT */}

            <Grid
              item
              xs={12}
              md={6}
            >
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ mb: 1 }}
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
          YOLO
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
            sx={{ mb: 0.5 }}
          >
            AI Animal Identification
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            YOLO livestock detection
          </Typography>

          {!aiResult ? (
            <Typography color="text.secondary">
              Upload and analyse an animal image
              to see the YOLO result.
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
                <Card variant="outlined">
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
                      sx={{ mt: 1 }}
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
                <Card variant="outlined">
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
                      sx={{ mt: 1 }}
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
                <Card variant="outlined">
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
                      sx={{ mt: 1 }}
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
                <Card variant="outlined">
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
                      sx={{ mt: 1 }}
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
          CNN HEALTH
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
            sx={{ mb: 0.5 }}
          >
            Health & Disease Analysis
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            CNN image classification
          </Typography>

          {!aiResult ? (
            <Typography color="text.secondary">
              CNN health classification will
              appear after image analysis.
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
                  <Card variant="outlined">
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
                        sx={{ mt: 1 }}
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
                  <Card variant="outlined">
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
                        sx={{ mt: 1 }}
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
                        sx={{ mt: 0.5 }}
                      >
                        {formatConfidence(
                          cnnConfidence
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {cnnPredictions.length >
                0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 1 }}
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
                              fontWeight={600}
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
            sx={{ mb: 0.5 }}
          >
            AI Farm Analysis
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
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
                sx={{ mb: 1 }}
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
                sx={{ mb: 1 }}
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
                sx={{ mb: 1 }}
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
          GROWTH
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
            sx={{ mb: 0.5 }}
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
            sx={{ mt: 2 }}
          >
            Growth and weight tracking can be
            connected to the selected animal
            record and production models.
          </Typography>
        </CardContent>
      </Card>

      {/* ====================================================
          STATUS
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
            sx={{ mb: 2 }}
          >
            Digital Twin Status
          </Typography>

          <Divider sx={{ mb: 2 }} />

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

              <Typography fontWeight={600}>
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

              <Typography fontWeight={600}>
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

              <Typography fontWeight={600}>
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

              <Typography fontWeight={600}>
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

              <Typography fontWeight={600}>
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

              <Typography fontWeight={600}>
                {xgboostStatus
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
              the selected Animal ID links the
              real farm record to the Digital Twin.
              The uploaded image is sent to the
              AI backend, where YOLO detects
              livestock and CNN performs the
              available health classification.
              Production and farm information can
              then be connected to the applicable
              ML models and animal records.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}