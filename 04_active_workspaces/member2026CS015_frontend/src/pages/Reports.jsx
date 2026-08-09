import { useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  MenuItem,
  Chip,
  Divider,
  LinearProgress,
} from "@mui/material";

import {
  Assessment,
  Download,
  TrendingUp,
  Pets,
  LocalDrink,
  Egg,
  ContentCut,
  Warning,
  CheckCircle,
  CalendarMonth,
} from "@mui/icons-material";


export default function Reports() {

  const [period, setPeriod] = useState("This Month");
  const [reportType, setReportType] = useState("Farm Overview");


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

      {/* ================= HEADER ================= */}

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
            Get a complete overview of
            your livestock farm performance.
          </Typography>

        </Box>


        <Button
          variant="contained"
          startIcon={<Download />}
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


      {/* ================= FILTERS ================= */}

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "none",
          border: "1px solid #e5e7eb",
          mb: 3,
        }}
      >

        <CardContent>

          <Grid
            container
            spacing={2}
            alignItems="center"
          >

            <Grid
              item
              xs={12}
              md={4}
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

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

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

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <Chip
                icon={<CalendarMonth />}
                label={`Report: ${period}`}
                sx={{
                  height: 45,
                  fontWeight: 800,
                }}
              />

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* ================= KPI CARDS ================= */}

      <Grid
        container
        spacing={2.5}
        sx={{ mb: 4 }}
      >

        <KpiCard
          title="Total Animals"
          value="248"
          subtitle="+12 this month"
          icon={<Pets />}
          background="#dbeafe"
          color="#2563eb"
        />

        <KpiCard
          title="Milk Production"
          value="1,284 L"
          subtitle="+8.4% vs last month"
          icon={<LocalDrink />}
          background="#dcfce7"
          color="#15803d"
        />

        <KpiCard
          title="Egg Production"
          value="8,420"
          subtitle="+5.2% vs last month"
          icon={<Egg />}
          background="#fef3c7"
          color="#d97706"
        />

        <KpiCard
          title="Wool Production"
          value="108 kg"
          subtitle="+6.7% vs last month"
          icon={<ContentCut />}
          background="#ede9fe"
          color="#7c3aed"
        />

      </Grid>


      {/* ================= FARM PERFORMANCE ================= */}

      <Grid
        container
        spacing={2.5}
      >

        <Grid
          item
          xs={12}
          md={7}
        >

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
                value={92}
                color="#16a34a"
              />

              <PerformanceRow
                label="Milk Production"
                value={86}
                color="#2563eb"
              />

              <PerformanceRow
                label="Egg Production"
                value={91}
                color="#d97706"
              />

              <PerformanceRow
                label="Wool Production"
                value={82}
                color="#7c3aed"
              />

              <PerformanceRow
                label="Feed Efficiency"
                value={88}
                color="#0891b2"
              />

            </CardContent>

          </Card>

        </Grid>


        {/* ================= FARM HEALTH ================= */}

        <Grid
          item
          xs={12}
          md={5}
        >

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "none",
              border: "1px solid #e5e7eb",
              height: "100%",
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
                value="221"
                percentage={89}
                color="#16a34a"
                icon={<CheckCircle />}
              />

              <HealthRow
                label="Under Observation"
                value="18"
                percentage={7}
                color="#d97706"
                icon={<Warning />}
              />

              <HealthRow
                label="Critical"
                value="9"
                percentage={4}
                color="#dc2626"
                icon={<Warning />}
              />

            </CardContent>

          </Card>

        </Grid>

      </Grid>


      {/* ================= PRODUCTION SUMMARY ================= */}

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


          <Grid
            container
            spacing={2}
          >

            <ProductionCard
              title="Milk"
              value="1,284 L"
              target="1,450 L"
              percentage={89}
              icon={<LocalDrink />}
              color="#2563eb"
              background="#dbeafe"
            />

            <ProductionCard
              title="Eggs"
              value="8,420"
              target="9,000"
              percentage={94}
              icon={<Egg />}
              color="#d97706"
              background="#fef3c7"
            />

            <ProductionCard
              title="Wool"
              value="108 kg"
              target="125 kg"
              percentage={86}
              icon={<ContentCut />}
              color="#7c3aed"
              background="#ede9fe"
            />

          </Grid>

        </CardContent>

      </Card>


      {/* ================= AI INSIGHTS ================= */}

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


          <Grid
            container
            spacing={2}
          >

            <Grid
              item
              xs={12}
              md={4}
            >

              <Insight
                title="Production"
                text="Overall production is trending upward by 7.4%."
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <Insight
                title="Animal Health"
                text="89% of animals are currently in healthy condition."
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <Insight
                title="Attention Required"
                text="9 animals require immediate health monitoring."
              />

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* ================= REPORT FOOTER ================= */}

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
          Generated by AgroLens PLF
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


/* =====================================================
   KPI CARD
===================================================== */

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  background,
  color,
}) {

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={3}
    >

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
                color: color,
              }}
            >
              {icon}
            </Box>

          </Box>


          <Typography
            variant="caption"
            sx={{
              color: "#16a34a",
              fontWeight: 700,
              display: "block",
              mt: 2,
            }}
          >
            {subtitle}
          </Typography>

        </CardContent>

      </Card>

    </Grid>
  );
}


/* =====================================================
   PERFORMANCE ROW
===================================================== */

function PerformanceRow({
  label,
  value,
  color,
}) {

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
          {value}%
        </Typography>

      </Box>


      <LinearProgress
        variant="determinate"
        value={value}
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


/* =====================================================
   HEALTH ROW
===================================================== */

function HealthRow({
  label,
  value,
  percentage,
  color,
  icon,
}) {

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

          <Typography
            fontWeight={900}
          >
            {value}
          </Typography>

        </Box>


        <LinearProgress
          variant="determinate"
          value={percentage}
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


/* =====================================================
   PRODUCTION CARD
===================================================== */

function ProductionCard({
  title,
  value,
  target,
  percentage,
  icon,
  color,
  background,
}) {

  return (
    <Grid
      item
      xs={12}
      md={4}
    >

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

          <Typography
            fontWeight={800}
          >
            {title}
          </Typography>

        </Box>


        <Typography
          variant="h5"
          fontWeight={900}
        >
          {value}
        </Typography>


        <Typography
          variant="caption"
          color="text.secondary"
        >
          Target: {target}
        </Typography>


        <LinearProgress
          variant="determinate"
          value={percentage}
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
          variant="caption"
          fontWeight={800}
          sx={{
            display: "block",
            mt: 0.5,
            color,
          }}
        >
          {percentage}% achieved
        </Typography>

      </Box>

    </Grid>
  );
}


/* =====================================================
   AI INSIGHT
===================================================== */

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