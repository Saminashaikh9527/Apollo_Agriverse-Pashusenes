import { useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  LinearProgress,
  MenuItem,
  TextField,
  Avatar,
} from "@mui/material";

import {
  AutoGraph,
  LocalDrink,
  Egg,
  ContentCut,
  Favorite,
  TrendingUp,
  Warning,
  Psychology,
  CalendarMonth,
  Refresh,
} from "@mui/icons-material";


export default function Predictions() {

  const [period, setPeriod] = useState("Next 30 Days");

  const [refreshing, setRefreshing] =
    useState(false);


  const refreshPredictions = () => {

    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);

  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f8ff",
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >

            <Avatar
              sx={{
                width: 52,
                height: 52,
                backgroundColor: "#ede9fe",
                color: "#7c3aed",
              }}
            >
              <AutoGraph />
            </Avatar>

            <Typography
              variant="h4"
              fontWeight={900}
              color="#172554"
            >
              AI Predictions 🔮
            </Typography>

          </Box>


          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Predict livestock health,
            production and farm performance
            using AI-powered analysis.
          </Typography>

        </Box>


        <Button
          variant="contained"
          startIcon={
            refreshing
              ? null
              : <Refresh />
          }
          onClick={refreshPredictions}
          disabled={refreshing}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 800,
            px: 3,
            backgroundColor: "#7c3aed",
            "&:hover": {
              backgroundColor: "#6d28d9",
            },
          }}
        >
          {refreshing
            ? "Updating..."
            : "Refresh Predictions"}
        </Button>

      </Box>


      {/* ================= AI STATUS ================= */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 4,
          color: "white",
          background:
            "linear-gradient(135deg, #312e81, #7c3aed)",
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
              md={8}
            >

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                }}
              >

                <Psychology
                  sx={{ fontSize: 38 }}
                />

                <Box>

                  <Typography
                    variant="h6"
                    fontWeight={900}
                  >
                    AI Prediction Engine Active
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.8 }}
                  >
                    Predictions are generated
                    from animal health,
                    production and behavioural
                    data.
                  </Typography>

                </Box>

              </Box>

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                select
                fullWidth
                value={period}
                onChange={(e) =>
                  setPeriod(e.target.value)
                }
                sx={{
                  backgroundColor:
                    "rgba(255,255,255,0.1)",
                  borderRadius: 2,

                  "& .MuiInputLabel-root": {
                    color: "white",
                  },

                  "& .MuiSelect-select": {
                    color: "white",
                  },

                  "& .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor:
                        "rgba(255,255,255,0.4)",
                    },
                }}
                label="Prediction Period"
              >

                <MenuItem value="Next 7 Days">
                  Next 7 Days
                </MenuItem>

                <MenuItem value="Next 30 Days">
                  Next 30 Days
                </MenuItem>

                <MenuItem value="Next 3 Months">
                  Next 3 Months
                </MenuItem>

              </TextField>

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* ================= PREDICTION CARDS ================= */}

      <Grid
        container
        spacing={2.5}
        sx={{ mb: 4 }}
      >

        <PredictionCard
          title="Milk Production"
          value="1,420 L"
          change="+10.6%"
          confidence="94%"
          subtitle="Expected next month"
          icon={<LocalDrink />}
          background="#dbeafe"
          color="#2563eb"
        />

        <PredictionCard
          title="Egg Production"
          value="9,180"
          change="+9.0%"
          confidence="91%"
          subtitle="Expected next month"
          icon={<Egg />}
          background="#fef3c7"
          color="#d97706"
        />

        <PredictionCard
          title="Wool Production"
          value="121 kg"
          change="+12.0%"
          confidence="87%"
          subtitle="Expected next cycle"
          icon={<ContentCut />}
          background="#ede9fe"
          color="#7c3aed"
        />

        <PredictionCard
          title="Healthy Animals"
          value="232"
          change="+4.9%"
          confidence="93%"
          subtitle="Expected healthy count"
          icon={<Favorite />}
          background="#dcfce7"
          color="#16a34a"
        />

      </Grid>


      {/* ================= HEALTH RISK ================= */}

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
              border:
                "1px solid #e5e7eb",
              height: "100%",
            }}
          >

            <CardContent>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                }}
              >

                <Favorite
                  sx={{ color: "#dc2626" }}
                />

                <Typography
                  variant="h6"
                  fontWeight={900}
                >
                  Disease Risk Prediction
                </Typography>

              </Box>


              <RiskRow
                animal="GOAT001 — Meenu"
                risk={82}
                level="High"
                color="#dc2626"
              />

              <RiskRow
                animal="COW002 — Lakshmi"
                risk={56}
                level="Medium"
                color="#d97706"
              />

              <RiskRow
                animal="SHE001 — Moti"
                risk={18}
                level="Low"
                color="#16a34a"
              />

              <RiskRow
                animal="BUF001 — Kamadhenu"
                risk={12}
                level="Low"
                color="#16a34a"
              />

              <RiskRow
                animal="COW001 — Gauri"
                risk={9}
                level="Low"
                color="#16a34a"
              />

            </CardContent>

          </Card>

        </Grid>


        {/* ================= FARM TREND ================= */}

        <Grid
          item
          xs={12}
          md={5}
        >

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "none",
              border:
                "1px solid #e5e7eb",
              height: "100%",
            }}
          >

            <CardContent>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                }}
              >

                <TrendingUp
                  sx={{ color: "#16a34a" }}
                />

                <Typography
                  variant="h6"
                  fontWeight={900}
                >
                  Farm Trend
                </Typography>

              </Box>


              <TrendItem
                label="Milk"
                value="+10.6%"
                color="#2563eb"
              />

              <TrendItem
                label="Eggs"
                value="+9.0%"
                color="#d97706"
              />

              <TrendItem
                label="Wool"
                value="+12.0%"
                color="#7c3aed"
              />

              <TrendItem
                label="Animal Health"
                value="+4.9%"
                color="#16a34a"
              />

              <TrendItem
                label="Feed Efficiency"
                value="+7.2%"
                color="#0891b2"
              />

            </CardContent>

          </Card>

        </Grid>

      </Grid>


      {/* ================= INDIVIDUAL PREDICTIONS ================= */}

      <Typography
        variant="h6"
        fontWeight={900}
        sx={{
          mt: 4,
          mb: 2,
        }}
      >
        Individual Animal Predictions
      </Typography>


      <Grid
        container
        spacing={2.5}
      >

        <AnimalPrediction
          emoji="🐄"
          id="COW001"
          name="Gauri"
          prediction="High milk potential"
          score={92}
          result="Expected 18.5 L/day"
          color="#2563eb"
        />

        <AnimalPrediction
          emoji="🐄"
          id="COW002"
          name="Lakshmi"
          prediction="Health attention"
          score={58}
          result="Monitor temperature"
          color="#d97706"
        />

        <AnimalPrediction
          emoji="🐃"
          id="BUF001"
          name="Kamadhenu"
          prediction="Stable production"
          score={89}
          result="Expected 14.2 L/day"
          color="#16a34a"
        />

        <AnimalPrediction
          emoji="🐐"
          id="GOAT001"
          name="Meenu"
          prediction="Health risk detected"
          score={35}
          result="Immediate observation"
          color="#dc2626"
        />

      </Grid>


      {/* ================= AI INSIGHTS ================= */}

      <Card
        sx={{
          mt: 4,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #172554, #2563eb)",
          color: "white",
        }}
      >

        <CardContent sx={{ p: 3 }}>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 3,
            }}
          >

            <Avatar
              sx={{
                backgroundColor:
                  "rgba(255,255,255,0.15)",
              }}
            >
              <AutoGraph />
            </Avatar>

            <Box>

              <Typography
                variant="h6"
                fontWeight={900}
              >
                AI Recommendations
              </Typography>

              <Typography
                variant="body2"
                sx={{ opacity: 0.75 }}
              >
                Actions suggested by the
                AgroLens prediction engine.
              </Typography>

            </Box>

          </Box>


          <Grid
            container
            spacing={2}
          >

            <Grid
              item
              xs={12}
              md={4}
            >

              <Recommendation
                icon={<Warning />}
                title="Check GOAT001"
                text="AI predicts elevated health risk. Perform a physical health check."
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <Recommendation
                icon={<LocalDrink />}
                title="Milk Production"
                text="Production is predicted to increase. Maintain current feeding routine."
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <Recommendation
                icon={<CalendarMonth />}
                title="Plan Resources"
                text="Prepare additional feed resources for the predicted production increase."
              />

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* ================= FOOTER ================= */}

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          mt: 3,
        }}
      >
        AgroLens PLF • AI predictions are
        estimates and should support,
        not replace, farmer and veterinary
        decisions.
      </Typography>

    </Box>
  );
}


/* =====================================================
   PREDICTION CARD
===================================================== */

function PredictionCard({
  title,
  value,
  change,
  confidence,
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
      lg={3}
    >

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "none",
          border:
            "1px solid #e5e7eb",
        }}
      >

        <CardContent>

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
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


            <Avatar
              sx={{
                backgroundColor:
                  background,
                color,
              }}
            >
              {icon}
            </Avatar>

          </Box>


          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              mt: 2,
            }}
          >

            <Chip
              size="small"
              label={change}
              sx={{
                color,
                backgroundColor:
                  background,
                fontWeight: 800,
              }}
            />

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {subtitle}
            </Typography>

          </Box>


          <Box sx={{ mt: 2 }}>

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
              }}
            >

              <Typography
                variant="caption"
                color="text.secondary"
              >
                AI Confidence
              </Typography>

              <Typography
                variant="caption"
                fontWeight={900}
              >
                {confidence}
              </Typography>

            </Box>


            <LinearProgress
              variant="determinate"
              value={parseInt(confidence)}
              sx={{
                mt: 0.5,
                height: 6,
                borderRadius: 5,

                "& .MuiLinearProgress-bar":
                  {
                    backgroundColor:
                      color,
                    borderRadius: 5,
                  },
              }}
            />

          </Box>

        </CardContent>

      </Card>

    </Grid>
  );
}


/* =====================================================
   RISK ROW
===================================================== */

function RiskRow({
  animal,
  risk,
  level,
  color,
}) {

  return (
    <Box sx={{ mb: 2.5 }}>

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          mb: 0.7,
        }}
      >

        <Typography
          variant="body2"
          fontWeight={800}
        >
          {animal}
        </Typography>

        <Chip
          size="small"
          label={`${level} • ${risk}%`}
          sx={{
            color,
            backgroundColor:
              level === "High"
                ? "#fee2e2"
                : level === "Medium"
                ? "#fef3c7"
                : "#dcfce7",
            fontWeight: 800,
          }}
        />

      </Box>


      <LinearProgress
        variant="determinate"
        value={risk}
        sx={{
          height: 8,
          borderRadius: 5,
          backgroundColor: "#e5e7eb",

          "& .MuiLinearProgress-bar":
            {
              backgroundColor: color,
              borderRadius: 5,
            },
        }}
      />

    </Box>
  );
}


/* =====================================================
   TREND ITEM
===================================================== */

function TrendItem({
  label,
  value,
  color,
}) {

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
        py: 1.5,
        borderBottom:
          "1px solid #f1f5f9",
      }}
    >

      <Typography
        fontWeight={700}
      >
        {label}
      </Typography>

      <Chip
        size="small"
        label={value}
        sx={{
          color,
          backgroundColor:
            "#f1f5f9",
          fontWeight: 900,
        }}
      />

    </Box>
  );
}


/* =====================================================
   ANIMAL PREDICTION
===================================================== */

function AnimalPrediction({
  emoji,
  id,
  name,
  prediction,
  score,
  result,
  color,
}) {

  return (
    <Grid
      item
      xs={12}
      sm={6}
      lg={3}
    >

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "none",
          border:
            "1px solid #e5e7eb",
        }}
      >

        <CardContent>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >

            <Avatar
              sx={{
                fontSize: 28,
                backgroundColor:
                  "#eff6ff",
              }}
            >
              {emoji}
            </Avatar>

            <Box>

              <Typography
                fontWeight={900}
              >
                {id}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {name}
              </Typography>

            </Box>

          </Box>


          <Typography
            variant="body2"
            color="text.secondary"
          >
            Prediction
          </Typography>


          <Typography
            fontWeight={900}
            sx={{
              color,
              mt: 0.5,
            }}
          >
            {prediction}
          </Typography>


          <Typography
            variant="body2"
            sx={{ mt: 1 }}
          >
            {result}
          </Typography>


          <LinearProgress
            variant="determinate"
            value={score}
            sx={{
              mt: 2,
              height: 7,
              borderRadius: 5,

              "& .MuiLinearProgress-bar":
                {
                  backgroundColor: color,
                },
            }}
          />


          <Typography
            variant="caption"
            color="text.secondary"
          >
            Prediction confidence:{" "}
            {score}%
          </Typography>

        </CardContent>

      </Card>

    </Grid>
  );
}


/* =====================================================
   RECOMMENDATION
===================================================== */

function Recommendation({
  icon,
  title,
  text,
}) {

  return (
    <Box
      sx={{
        p: 2,
        height: "100%",
        borderRadius: 3,
        backgroundColor:
          "rgba(255,255,255,0.1)",
      }}
    >

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 1,
        }}
      >

        {icon}

        <Typography
          fontWeight={900}
        >
          {title}
        </Typography>

      </Box>


      <Typography
        variant="body2"
        sx={{ opacity: 0.8 }}
      >
        {text}
      </Typography>

    </Box>
  );
}