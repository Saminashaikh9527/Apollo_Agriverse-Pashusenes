import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from "@mui/material";

import {
  Pets,
  LocalDrink,
  Egg,
  Grass,
  Texture,
  TrendingUp,
  WarningAmber,
  CheckCircle,
  ArrowForward,
  Refresh,
  Home,
  ArrowBack,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { getAnimals } from "../api/animals";
import { getFarms } from "../api/farms";
import { getMilkRecords } from "../api/milk";
import { getFeedRecords } from "../api/feed";
import { getEggRecords } from "../api/egg";
import { getWoolRecords } from "../api/wool";
import { getHealthRecords } from "../api/health";
import { getGrowthRecords } from "../api/growth";
import { getVaccinationRecords } from "../api/vaccination";

export default function Dashboard() {
  const navigate = useNavigate();

  const [animals, setAnimals] = useState([]);
  const [moduleCounts, setModuleCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD ANIMALS
  ========================================================= */

  const loadAnimals = async () => {
    try {
      setLoading(true);
      setError("");

      const requests = [
        getAnimals(),
        getFarms(),
        getMilkRecords(),
        getFeedRecords(),
        getEggRecords(),
        getWoolRecords(),
        getHealthRecords(),
        getGrowthRecords(),
        getVaccinationRecords(),
      ];

      const results = await Promise.allSettled(requests);

      const [animalResult, ...otherResults] = results;

      if (animalResult.status !== "fulfilled") {
        throw animalResult.reason;
      }

      setAnimals(
        Array.isArray(animalResult.value)
          ? animalResult.value
          : []
      );

      const names = [
        "farms",
        "milk",
        "feed",
        "eggs",
        "wool",
        "health",
        "growth",
        "vaccination",
      ];

      setModuleCounts(
        Object.fromEntries(
          otherResults.map(
            (result, index) => [
              names[index],
              result.status === "fulfilled" &&
              Array.isArray(result.value)
                ? result.value.length
                : null,
            ]
          )
        )
      );
    } catch (err) {
      console.error(
        "Dashboard animals error:",
        err
      );

      setError(
        err?.message ||
          "Failed to load animals."
      );

      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnimals();
  }, []);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const statistics = useMemo(() => {
    const total = animals.length;

    const getSpeciesCount = (speciesName) => {
      return animals.filter((animal) =>
        String(animal?.species || "")
          .trim()
          .toLowerCase()
          .includes(speciesName)
      ).length;
    };

    return {
      total,
      cows: getSpeciesCount("cow"),
      buffaloes: getSpeciesCount("buffalo"),
      goats: getSpeciesCount("goat"),
      sheep: getSpeciesCount("sheep"),
      chickens: getSpeciesCount("chicken"),
      farms: moduleCounts.farms,
      milk: moduleCounts.milk,
      feed: moduleCounts.feed,
      eggs: moduleCounts.eggs,
      wool: moduleCounts.wool,
      health: moduleCounts.health,
      growth: moduleCounts.growth,
      vaccination: moduleCounts.vaccination,
    };
  }, [animals, moduleCounts]);

  /* =========================================================
     ANIMAL HELPERS
  ========================================================= */

  const getAnimalId = (animal) =>
    animal?.animal_id ??
    animal?.id ??
    animal?.animalId ??
    "-";

  const getAnimalName = (animal) =>
    animal?.tag_number ||
    animal?.tagNumber ||
    `Animal ${getAnimalId(animal)}`;

  const getSpecies = (animal) =>
    animal?.species || "Unknown";

  const getStatus = (animal) =>
    animal?.status || "Active";

  /* =========================================================
     STATUS COLOR
  ========================================================= */

  const getStatusColor = (status) => {
    const value = String(status).toLowerCase();

    if (
      value.includes("healthy") ||
      value.includes("active") ||
      value.includes("normal")
    ) {
      return "success";
    }

    if (
      value.includes("warning") ||
      value.includes("attention")
    ) {
      return "warning";
    }

    if (
      value.includes("sick") ||
      value.includes("critical") ||
      value.includes("inactive")
    ) {
      return "error";
    }

    return "default";
  };

  /* =========================================================
     STAT CARDS
  ========================================================= */

  const statCards = [
    {
      title: "Total Animals",
      value: statistics.total,
      icon: <Pets />,
      background: "#ede9fe",
      color: "#7c3aed",
    },
    {
      title: "Cows",
      value: statistics.cows,
      icon: <Pets />,
      background: "#dcfce7",
      color: "#16a34a",
    },
    {
      title: "Buffaloes",
      value: statistics.buffaloes,
      icon: <Pets />,
      background: "#dbeafe",
      color: "#2563eb",
    },
    {
      title: "Goats",
      value: statistics.goats,
      icon: <Pets />,
      background: "#ffedd5",
      color: "#ea580c",
    },
    {
      title: "Sheep",
      value: statistics.sheep,
      icon: <Pets />,
      background: "#fce7f3",
      color: "#db2777",
    },
    {
      title: "Chickens",
      value: statistics.chickens,
      icon: <Egg />,
      background: "#fef9c3",
      color: "#ca8a04",
    },
  ];

  /* =========================================================
     UI
  ========================================================= */

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        maxWidth: 1600,
        mx: "auto",
        width: "100%",
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: "#064e3b",
              mb: 0.5,
            }}
          >
            Dashboard
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
            }}
          >
            Welcome to Apollo Agriverse PashuSense —
            Precision Livestock Farming.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          {/* BACK TO HOME */}

          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 800,
              backgroundColor: "#047857",

              "&:hover": {
                backgroundColor: "#065f46",
              },
            }}
          >
            Back to Home
          </Button>

          {/* REFRESH */}

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadAnimals}
            disabled={loading}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
        >
          {error}
        </Alert>
      )}

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(6, 1fr)",
          },

          gap: 2.5,
          mb: 4,
        }}
      >
        {statCards.map((stat) => (
          <Card
            key={stat.title}
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",

              transition:
                "all 0.2s ease",

              "&:hover": {
                transform:
                  "translateY(-3px)",

                boxShadow:
                  "0 12px 30px rgba(0,0,0,0.08)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {stat.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: "#0f172a",
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={28}
                      />
                    ) : (
                      stat.value
                    )}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                    backgroundColor:
                      stat.background,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* =====================================================
          QUICK OVERVIEW
      ====================================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {/* ===================================================
            LIVESTOCK OVERVIEW
        =================================================== */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border:
              "1px solid #e2e8f0",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  Livestock Overview
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    mt: 0.5,
                  }}
                >
                  Current animals
                  registered in your farm.
                </Typography>
              </Box>

              <Pets
                sx={{
                  color: "#16a34a",
                  fontSize: 32,
                }}
              />
            </Box>

            <Divider sx={{ mb: 2 }} />

            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "center",
                  py: 5,
                }}
              >
                <CircularProgress />
              </Box>
            ) : animals.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 5,
                }}
              >
                <Pets
                  sx={{
                    fontSize: 50,
                    color: "#cbd5e1",
                    mb: 1,
                  }}
                />

                <Typography
                  sx={{
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  No animals registered yet.
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {animals
                  .slice(0, 6)
                  .map((animal) => (
                    <Box
                      key={getAnimalId(
                        animal
                      )}
                      sx={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 3,
                        backgroundColor:
                          "#f8fafc",
                        border:
                          "1px solid #e2e8f0",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 44,
                          height: 44,
                          backgroundColor:
                            "#dcfce7",
                          color:
                            "#15803d",
                        }}
                      >
                        <Pets fontSize="small" />
                      </Avatar>

                      <Box
                        sx={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 800,
                            color:
                              "#0f172a",
                            overflow:
                              "hidden",
                            textOverflow:
                              "ellipsis",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {getAnimalName(
                            animal
                          )}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              "#64748b",
                          }}
                        >
                          {getSpecies(
                            animal
                          )}
                        </Typography>
                      </Box>

                      <Chip
                        label={getStatus(
                          animal
                        )}
                        size="small"
                        color={getStatusColor(
                          getStatus(
                            animal
                          )
                        )}
                        sx={{
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                  ))}
              </Box>
            )}

            {animals.length > 6 && (
              <Button
                endIcon={
                  <ArrowForward />
                }
                sx={{
                  mt: 2,
                  textTransform:
                    "none",
                  fontWeight: 700,
                }}
                onClick={() =>
                  navigate("/animals")
                }
              >
                View all animals
              </Button>
            )}
          </CardContent>
        </Card>

        {/* ===================================================
            FARM HEALTH
        =================================================== */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border:
              "1px solid #e2e8f0",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                mb: 2,
              }}
            >
              Farm Health
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems:
                  "center",
                gap: 2,
                p: 2,
                borderRadius: 3,
                backgroundColor:
                  "#f0fdf4",
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  backgroundColor:
                    "#dcfce7",
                  color: "#16a34a",
                }}
              >
                <CheckCircle />
              </Avatar>

              <Box>
                <Typography
                  fontWeight={800}
                  color="#166534"
                >
                  System Healthy
                </Typography>

                <Typography
                  variant="body2"
                  color="#64748b"
                >
                  Livestock monitoring is active.
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems:
                  "center",
                gap: 2,
                p: 2,
                borderRadius: 3,
                backgroundColor:
                  "#fffbeb",
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  backgroundColor:
                    "#fef3c7",
                  color: "#d97706",
                }}
              >
                <WarningAmber />
              </Avatar>

              <Box>
                <Typography
                  fontWeight={800}
                  color="#92400e"
                >
                  Alerts
                </Typography>

                <Typography
                  variant="body2"
                  color="#64748b"
                >
                  No critical alerts detected.
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems:
                  "center",
                gap: 2,
                p: 2,
                borderRadius: 3,
                backgroundColor:
                  "#eff6ff",
              }}
            >
              <Avatar
                sx={{
                  backgroundColor:
                    "#dbeafe",
                  color: "#2563eb",
                }}
              >
                <TrendingUp />
              </Avatar>

              <Box>
                <Typography
                  fontWeight={800}
                  color="#1e40af"
                >
                  AI Monitoring
                </Typography>

                <Typography
                  variant="body2"
                  color="#64748b"
                >
                  AI insights are available.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* =====================================================
          PRODUCTION MANAGEMENT
      ====================================================== */}

      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          color: "#0f172a",
          mb: 2,
        }}
      >
        Production Management
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2.5,
        }}
      >
        <ProductionCard
          icon={<LocalDrink />}
          title="Milk Production"
          description={
            statistics.milk == null
              ? "Milk records unavailable."
              : `${statistics.milk} live milk record${
                  statistics.milk === 1
                    ? ""
                    : "s"
                }.`
          }
          color="#2563eb"
          background="#dbeafe"
          path="/milk"
        />

        <ProductionCard
          icon={<Egg />}
          title="Egg Production"
          description={
            statistics.eggs == null
              ? "Egg records unavailable."
              : `${statistics.eggs} live egg record${
                  statistics.eggs === 1
                    ? ""
                    : "s"
                }.`
          }
          color="#ca8a04"
          background="#fef9c3"
          path="/eggs"
        />

        <ProductionCard
          icon={<Texture />}
          title="Wool Production"
          description={
            statistics.wool == null
              ? "Wool records unavailable."
              : `${statistics.wool} live wool record${
                  statistics.wool === 1
                    ? ""
                    : "s"
                }.`
          }
          color="#db2777"
          background="#fce7f3"
          path="/wool"
        />

        <ProductionCard
          icon={<Grass />}
          title="Feed Management"
          description={
            statistics.feed == null
              ? "Feed records unavailable."
              : `${statistics.feed} live feed record${
                  statistics.feed === 1
                    ? ""
                    : "s"
                }.`
          }
          color="#65a30a"
          background="#ecfccb"
          path="/feed"
        />
      </Box>
    </Box>
  );
}

/* =========================================================
   PRODUCTION CARD
========================================================= */

function ProductionCard({
  icon,
  title,
  description,
  color,
  background,
  path,
}) {
  const navigate = useNavigate();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border:
          "1px solid #e2e8f0",
        cursor: "pointer",

        transition:
          "all 0.2s ease",

        "&:hover": {
          transform:
            "translateY(-4px)",

          boxShadow:
            "0 12px 30px rgba(0,0,0,0.08)",
        },
      }}
      onClick={() => navigate(path)}
    >
      <CardContent>
        <Avatar
          sx={{
            width: 50,
            height: 50,
            backgroundColor:
              background,
            color,
            mb: 2,
          }}
        >
          {icon}
        </Avatar>

        <Typography
          sx={{
            fontWeight: 800,
            color: "#0f172a",
            mb: 0.5,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}