
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  Assessment,
  Download,
  Pets,
  LocalDrink,
  Egg,
  ContentCut,
  Warning,
  CheckCircle,
  CalendarMonth,
} from "@mui/icons-material";

import {
  getReportOverview,
  getHealthSummary,
  getProductionSummary,
} from "../api/api";

// ============================================================
// REPORTS PAGE
// ============================================================

export default function Reports() {
  const [period, setPeriod] = useState("This Month");
  const [reportType, setReportType] = useState("Farm Overview");

  const [overview, setOverview] = useState(null);
  const [healthSummary, setHealthSummary] = useState(null);
  const [productionSummary, setProductionSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const FARM_ID = 7;

  // ==========================================================
  // LOAD REPORTS
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    async function loadReports() {
      try {
        setLoading(true);
        setError("");

        const results = await Promise.allSettled([
          getReportOverview(FARM_ID),
          getHealthSummary(FARM_ID),
          getProductionSummary(FARM_ID),
        ]);

        if (!mounted) return;

        const [overviewResult, healthResult, productionResult] =
          results;

        if (overviewResult.status === "fulfilled") {
          setOverview(overviewResult.value);
        }

        if (healthResult.status === "fulfilled") {
          setHealthSummary(healthResult.value);
        }

        if (productionResult.status === "fulfilled") {
          setProductionSummary(productionResult.value);
        }

        const failed = results.some(
          (result) => result.status === "rejected"
        );

        if (failed) {
          setError(
            "Some report data could not be loaded. Showing available farm information."
          );
        }
      } catch (err) {
        console.error("Reports Error:", err);

        if (mounted) {
          setError(
            "Report data could not be loaded. Showing available farm information."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f7f9fc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />

          <Typography
            sx={{
              mt: 2,
              color: "text.secondary",
            }}
          >
            Loading reports...
          </Typography>
        </Box>
      </Box>
    );
  }

  // ==========================================================
  // SAFE DATA
  // ==========================================================

  const totalAnimals =
    Number(overview?.total_animals ?? 0);

  const milkLitres = Number(
    overview?.milk_production?.litres ??
      productionSummary?.milk_litres ??
      0
  );

  const milkPrevious = Number(
    overview?.milk_production?.previous_month_litres ?? 0
  );

  const eggCount = Number(
    overview?.egg_production?.count ??
      productionSummary?.eggs ??
      0
  );

  const eggPrevious = Number(
    overview?.egg_production?.previous_month_count ?? 0
  );

  const woolKg = Number(
    overview?.wool_production?.kg ??
      productionSummary?.wool_kg ??
      0
  );

  const woolPrevious = Number(
    overview?.wool_production?.previous_month_kg ?? 0
  );

  const healthy = Number(
    healthSummary?.healthy ??
      overview?.animal_health?.healthy ??
      0
  );

  const underObservation = Number(
    healthSummary?.under_observation ??
      overview?.animal_health?.under_observation ??
      0
  );

  const critical = Number(
    healthSummary?.critical ??
      overview?.animal_health?.critical ??
      0
  );

  const healthPercentage = Number(
    overview?.animal_health?.health_percentage ??
      healthSummary?.health_percentage ??
      (totalAnimals > 0
        ? (healthy / totalAnimals) * 100
        : 0)
  );

  const performance = overview?.performance ?? {};

  const targets =
    overview?.targets ??
    productionSummary?.targets ??
    {};

  const milkTarget = Number(
    targets?.milk_litres ?? 1450
  );

  const eggTarget = Number(
    targets?.eggs ?? 9000
  );

  const woolTarget = Number(
    targets?.wool_kg ?? 125
  );

  // ==========================================================
  // CHANGE DISPLAY
  // ==========================================================

  const milkChange =
    overview?.milk_production?.change_percent;

  const eggChange =
    overview?.egg_production?.change_percent;

  const woolChange =
    overview?.wool_production?.change_percent;

  function getChangeText(current, previous, change) {
    if (
      previous === 0 &&
      current > 0
    ) {
      return "No previous-month data";
    }

    if (
      previous === 0 &&
      current === 0
    ) {
      return "No previous-month data";
    }

    const value = Number(change ?? 0);

    if (value > 0) {
      return `↑ ${value}% vs last month`;
    }

    if (value < 0) {
      return `↓ ${Math.abs(value)}% vs last month`;
    }

    return "No change vs last month";
  }

  const milkChangeText = getChangeText(
    milkLitres,
    milkPrevious,
    milkChange
  );

  const eggChangeText = getChangeText(
    eggCount,
    eggPrevious,
    eggChange
  );

  const woolChangeText = getChangeText(
    woolKg,
    woolPrevious,
    woolChange
  );

  // ==========================================================
  // PRODUCTION PERCENTAGES
  // ==========================================================

  const milkPercentage =
    milkTarget > 0
      ? Math.min(
          100,
          Number(
            (
              (milkLitres / milkTarget) *
              100
            ).toFixed(1)
          )
        )
      : 0;

  const eggPercentage =
    eggTarget > 0
      ? Math.min(
          100,
          Number(
            (
              (eggCount / eggTarget) *
              100
            ).toFixed(1)
          )
        )
      : 0;

  const woolPercentage =
    woolTarget > 0
      ? Math.min(
          100,
          Number(
            (
              (woolKg / woolTarget) *
              100
            ).toFixed(1)
          )
        )
      : 0;

  // ==========================================================
  // PERFORMANCE
  // ==========================================================

  const animalHealthPerformance = Number(
    performance?.animal_health ??
      healthPercentage ??
      0
  );

  const milkPerformance = Number(
    performance?.milk_production ??
      milkPercentage ??
      0
  );

  const eggPerformance = Number(
    performance?.egg_production ??
      eggPercentage ??
      0
  );

  const woolPerformance = Number(
    performance?.wool_production ??
      woolPercentage ??
      0
  );

  const feedEfficiency = Number(
    performance?.feed_efficiency ?? 0
  );

  // ==========================================================
  // DOWNLOAD REPORT
  // ==========================================================

  function handleDownload() {
    const reportText = `
Apollo Agriverse - PashuSense
Precision Livestock Farming
========================================

Farm ID: ${FARM_ID}
Period: ${overview?.period || period}
Report Type: ${reportType}

TOTAL ANIMALS
----------------------------------------
Total Animals: ${totalAnimals}
Healthy: ${healthy}
Under Observation: ${underObservation}
Critical: ${critical}

PRODUCTION
----------------------------------------
Milk Production: ${milkLitres.toFixed(2)} L
Milk Previous Month: ${
      milkPrevious.toFixed(2)
    } L
Milk Change: ${
      milkPrevious > 0
        ? `${milkChange ?? 0}%`
        : "No previous-month data"
    }

Egg Production: ${eggCount}
Egg Previous Month: ${eggPrevious}
Egg Change: ${
      eggPrevious > 0
        ? `${eggChange ?? 0}%`
        : "No previous-month data"
    }

Wool Production: ${woolKg.toFixed(2)} kg
Wool Previous Month: ${
      woolPrevious.toFixed(2)
    } kg
Wool Change: ${
      woolPrevious > 0
        ? `${woolChange ?? 0}%`
        : "No previous-month data"
    }

TARGETS
----------------------------------------
Milk Target: ${milkTarget} L
Egg Target: ${eggTarget}
Wool Target: ${woolTarget} kg

PERFORMANCE
----------------------------------------
Animal Health: ${animalHealthPerformance.toFixed(1)}%
Milk Production: ${milkPerformance.toFixed(1)}%
Egg Production: ${eggPerformance.toFixed(1)}%
Wool Production: ${woolPerformance.toFixed(1)}%
Feed Efficiency: ${feedEfficiency.toFixed(1)}%

Generated by Apollo Agriverse - PashuSense
`;

    const blob = new Blob(
      [reportText],
      {
        type: "text/plain;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "Apollo-Agriverse-PashuSense-Report.txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f9fc",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={900}
            color="#172554"
          >
            Reports & Analytics 📊
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Get a complete overview of your
            livestock farm performance.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleDownload}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 800,
            backgroundColor: "#2563eb",
            px: 3,
            "&:hover": {
              backgroundColor: "#1d4ed8",
            },
          }}
        >
          Download Report
        </Button>
      </Box>

      {/* ERROR / PARTIAL DATA */}

      {error && (
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
        >
          {error}
        </Alert>
      )}

      {/* FILTERS */}

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "none",
          border: "1px solid #e5e7eb",
          mb: 3,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
              alignItems: "center",
            }}
          >
            <TextField
              select
              fullWidth
              label="Report Type"
              value={reportType}
              onChange={(e) =>
                setReportType(e.target.value)
              }
            >
              <MenuItem value="Farm Overview">
                Farm Overview
              </MenuItem>

              <MenuItem value="Animal Health">
                Animal Health
              </MenuItem>

              <MenuItem value="Milk Production">
                Milk Production
              </MenuItem>

              <MenuItem value="Egg Production">
                Egg Production
              </MenuItem>

              <MenuItem value="Wool Production">
                Wool Production
              </MenuItem>

              <MenuItem value="Financial">
                Financial Report
              </MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="Period"
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value)
              }
            >
              <MenuItem value="Today">
                Today
              </MenuItem>

              <MenuItem value="This Week">
                This Week
              </MenuItem>

              <MenuItem value="This Month">
                This Month
              </MenuItem>

              <MenuItem value="Last 3 Months">
                Last 3 Months
              </MenuItem>

              <MenuItem value="This Year">
                This Year
              </MenuItem>
            </TextField>

            <Box>
              <Chip
                icon={<CalendarMonth />}
                label={`Report: ${
                  overview?.period || period
                }`}
                sx={{
                  height: 45,
                  fontWeight: 800,
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* KPI CARDS */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2.5,
          mb: 4,
        }}
      >
        <KpiCard
          title="Total Animals"
          value={totalAnimals}
          subtitle={`${healthy} healthy animals`}
          icon={<Pets />}
          background="#dbeafe"
          color="#2563eb"
        />

        <KpiCard
          title="Milk Production"
          value={`${milkLitres.toFixed(1)} L`}
          subtitle={milkChangeText}
          icon={<LocalDrink />}
          background="#dcfce7"
          color="#15803d"
        />

        <KpiCard
          title="Egg Production"
          value={eggCount}
          subtitle={eggChangeText}
          icon={<Egg />}
          background="#fef3c7"
          color="#d97706"
        />

        <KpiCard
          title="Wool Production"
          value={`${woolKg.toFixed(1)} kg`}
          subtitle={woolChangeText}
          icon={<ContentCut />}
          background="#ede9fe"
          color="#7c3aed"
        />
      </Box>

      {/* PERFORMANCE + HEALTH */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "7fr 5fr",
          },
          gap: 2.5,
        }}
      >
        {/* PERFORMANCE */}

        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "none",
            border: "1px solid #e5e7eb",
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 3,
              }}
            >
              <Assessment
                sx={{
                  color: "#2563eb",
                  fontSize: 30,
                }}
              />

              <Typography
                variant="h6"
                fontWeight={900}
              >
                Farm Performance
              </Typography>
            </Box>

            <PerformanceRow
              label="Animal Health"
              value={animalHealthPerformance}
              color="#16a34a"
            />

            <PerformanceRow
              label="Milk Production"
              value={milkPerformance}
              color="#2563eb"
            />

            <PerformanceRow
              label="Egg Production"
              value={eggPerformance}
              color="#d97706"
            />

            <PerformanceRow
              label="Wool Production"
              value={woolPerformance}
              color="#7c3aed"
            />

            <PerformanceRow
              label="Feed Efficiency"
              value={feedEfficiency}
              color="#0891b2"
            />
          </CardContent>
        </Card>

        {/* HEALTH */}

        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "none",
            border: "1px solid #e5e7eb",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              fontWeight={900}
              sx={{ mb: 3 }}
            >
              Animal Health Summary
            </Typography>

            <HealthRow
              label="Healthy"
              value={healthy}
              percentage={
                totalAnimals > 0
                  ? (healthy / totalAnimals) * 100
                  : 0
              }
              color="#16a34a"
              icon={<CheckCircle />}
            />

            <HealthRow
              label="Under Observation"
              value={underObservation}
              percentage={
                totalAnimals > 0
                  ? (underObservation /
                      totalAnimals) *
                    100
                  : 0
              }
              color="#d97706"
              icon={<Warning />}
            />

            <HealthRow
              label="Critical"
              value={critical}
              percentage={
                totalAnimals > 0
                  ? (critical / totalAnimals) * 100
                  : 0
              }
              color="#dc2626"
              icon={<Warning />}
            />
          </CardContent>
        </Card>
      </Box>

      {/* PRODUCTION SUMMARY */}

      <Card
        sx={{
          mt: 3,
          borderRadius: 4,
          boxShadow: "none",
          border: "1px solid #e5e7eb",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={900}
            sx={{ mb: 3 }}
          >
            Production Summary
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            <ProductionCard
              title="Milk"
              value={`${milkLitres.toFixed(1)} L`}
              target={`${milkTarget} L`}
              percentage={milkPercentage}
              icon={<LocalDrink />}
              color="#2563eb"
              background="#dbeafe"
            />

            <ProductionCard
              title="Eggs"
              value={eggCount}
              target={`${eggTarget}`}
              percentage={eggPercentage}
              icon={<Egg />}
              color="#d97706"
              background="#fef3c7"
            />

            <ProductionCard
              title="Wool"
              value={`${woolKg.toFixed(1)} kg`}
              target={`${woolTarget} kg`}
              percentage={woolPercentage}
              icon={<ContentCut />}
              color="#7c3aed"
              background="#ede9fe"
            />
          </Box>
        </CardContent>
      </Card>

      {/* AI INSIGHTS */}

      <Card
        sx={{
          mt: 3,
          borderRadius: 4,
          color: "white",
          background:
            "linear-gradient(135deg, #172554, #2563eb)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            fontWeight={900}
          >
            🤖 AI Farm Insights
          </Typography>

          <Typography
            sx={{
              opacity: 0.8,
              mt: 0.5,
              mb: 3,
            }}
          >
            Automated analysis of your
            farm data.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {Array.isArray(
              overview?.ai_insights
            ) &&
            overview.ai_insights.length > 0 ? (
              overview.ai_insights.map(
                (insight, index) => (
                  <Insight
                    key={index}
                    title={
                      insight?.category ||
                      "Farm Insight"
                    }
                    text={
                      insight?.message ||
                      "No additional information available."
                    }
                  />
                )
              )
            ) : (
              <>
                <Insight
                  title="Production"
                  text="Production data is currently available."
                />

                <Insight
                  title="Animal Health"
                  text={`${healthPercentage.toFixed(
                    1
                  )}% of animals are currently classified as healthy.`}
                />

                <Insight
                  title="Attention Required"
                  text={
                    critical > 0
                      ? `${critical} animal(s) require health monitoring.`
                      : "No animals are currently classified as critical."
                  }
                />
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* FOOTER */}

      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Generated by Apollo Agriverse - PashuSense
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Report type: {reportType}
        </Typography>
      </Box>
    </Box>
  );
}

// ============================================================
// KPI CARD
// ============================================================

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  background,
  color,
}) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "none",
        border: "1px solid #e5e7eb",
        height: "100%",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {title}
            </Typography>

            <Typography
              variant="h5"
              fontWeight={900}
              sx={{ mt: 0.5 }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: background,
              color,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{
            color:
              subtitle?.includes("↑")
                ? "#16a34a"
                : subtitle?.includes("↓")
                ? "#dc2626"
                : "#64748b",
            fontWeight: 700,
            display: "block",
            mt: 2,
          }}
        >
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}

// ============================================================
// PERFORMANCE ROW
// ============================================================

function PerformanceRow({
  label,
  value,
  color,
}) {
  const safeValue = Math.min(
    100,
    Math.max(0, Number(value) || 0)
  );

  return (
    <Box sx={{ mb: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 0.7,
        }}
      >
        <Typography
          variant="body2"
          fontWeight={700}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          fontWeight={900}
          sx={{ color }}
        >
          {safeValue.toFixed(1)}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={safeValue}
        sx={{
          height: 8,
          borderRadius: 5,
          backgroundColor: "#e5e7eb",

          "& .MuiLinearProgress-bar": {
            backgroundColor: color,
            borderRadius: 5,
          },
        }}
      />
    </Box>
  );
}

// ============================================================
// HEALTH ROW
// ============================================================

function HealthRow({
  label,
  value,
  percentage,
  color,
  icon,
}) {
  const safePercentage = Math.min(
    100,
    Math.max(0, Number(percentage) || 0)
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 2.5,
      }}
    >
      <Box
        sx={{
          color,
          display: "flex",
        }}
      >
        {icon}
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body2"
            fontWeight={700}
          >
            {label}
          </Typography>

          <Typography fontWeight={900}>
            {value}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={safePercentage}
          sx={{
            mt: 0.8,
            height: 6,
            borderRadius: 5,

            "& .MuiLinearProgress-bar": {
              backgroundColor: color,
            },
          }}
        />
      </Box>
    </Box>
  );
}

// ============================================================
// PRODUCTION CARD
// ============================================================

function ProductionCard({
  title,
  value,
  target,
  percentage,
  icon,
  color,
  background,
}) {
  const safePercentage = Math.min(
    100,
    Math.max(0, Number(percentage) || 0)
  );

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        backgroundColor: background,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color,
          mb: 1,
        }}
      >
        {icon}

        <Typography fontWeight={800}>
          {title}
        </Typography>
      </Box>

      <Typography
        variant="h5"
        fontWeight={900}
      >
        {value}
      </Typography>

      {/* FIXED TARGET DISPLAY */}

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 0.5,
        }}
      >
        Target:{" "}
        <strong>{target}</strong>
      </Typography>

      <LinearProgress
        variant="determinate"
        value={safePercentage}
        sx={{
          mt: 2,
          height: 7,
          borderRadius: 5,

          "& .MuiLinearProgress-bar": {
            backgroundColor: color,
            borderRadius: 5,
          },
        }}
      />

      <Typography
        variant="body2"
        fontWeight={800}
        sx={{
          display: "block",
          mt: 1,
          color,
        }}
      >
        {safePercentage.toFixed(1)}% achieved
      </Typography>
    </Box>
  );
}

// ============================================================
// AI INSIGHT
// ============================================================

function Insight({
  title,
  text,
}) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        backgroundColor:
          "rgba(255,255,255,0.1)",
        height: "100%",
      }}
    >
      <Typography
        fontWeight={900}
        sx={{ mb: 0.5 }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        sx={{ opacity: 0.8 }}
      >
        {text}
      </Typography>
    </Box>
  );
}

