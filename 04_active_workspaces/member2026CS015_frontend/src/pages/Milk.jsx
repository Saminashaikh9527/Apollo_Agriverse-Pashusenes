import { useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Button,
  LinearProgress,
  TextField,
  MenuItem,
  Stack,
  Divider,
  Alert,
} from "@mui/material";

import {
  LocalDrink,
  TrendingUp,
  TrendingDown,
  Pets,
  CalendarMonth,
  AccessTime,
  Analytics,
  Add,
  Warning,
  CheckCircle,
} from "@mui/icons-material";


const animals = [
  {
    tag: "COW001",
    name: "Lakshmi",
    breed: "Gir",
    emoji: "🐄",
    morning: 14,
    evening: 14,
    target: 30,
    quality: "Excellent",
    status: "Normal",
  },

  {
    tag: "COW002",
    name: "Ganga",
    breed: "Holstein",
    emoji: "🐄",
    morning: 16,
    evening: 15,
    target: 32,
    quality: "Excellent",
    status: "Normal",
  },

  {
    tag: "COW023",
    name: "Kamadhenu",
    breed: "Jersey",
    emoji: "🐄",
    morning: 10,
    evening: 9,
    target: 27,
    quality: "Good",
    status: "Low Production",
  },

  {
    tag: "BUF001",
    name: "Nandini",
    breed: "Murrah",
    emoji: "🐃",
    morning: 9,
    evening: 9,
    target: 20,
    quality: "Excellent",
    status: "Normal",
  },
];


export default function Milk() {

  const [selectedAnimal, setSelectedAnimal] =
    useState("ALL");

  const [date, setDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );


  const filteredAnimals =
    selectedAnimal === "ALL"
      ? animals
      : animals.filter(
          (animal) =>
            animal.tag === selectedAnimal
        );


  const totalMilk =
    animals.reduce(
      (sum, animal) =>
        sum +
        animal.morning +
        animal.evening,
      0
    );


  const totalTarget =
    animals.reduce(
      (sum, animal) =>
        sum + animal.target,
      0
    );


  const productionRate =
    Math.round(
      (totalMilk / totalTarget) * 100
    );


  const lowProduction =
    animals.filter(
      (animal) =>
        animal.status ===
        "Low Production"
    ).length;


  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f6faf8",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
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
            color="#12372a"
          >
            Milk Management 🥛
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Track milk production,
            animal performance and
            daily yield trends.
          </Typography>

        </Box>


        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 800,
            backgroundColor:
              "#047857",
            px: 3,
            "&:hover": {
              backgroundColor:
                "#065f46",
            },
          }}
        >
          Add Milk Record
        </Button>

      </Box>


      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <Grid
        container
        spacing={2.5}
        sx={{ mb: 4 }}
      >

        <SummaryCard
          title="Today's Milk"
          value={`${totalMilk} L`}
          subtitle="Total production"
          icon={<LocalDrink />}
          background="#dbeafe"
          color="#2563eb"
        />

        <SummaryCard
          title="Daily Target"
          value={`${totalTarget} L`}
          subtitle="Expected production"
          icon={<Analytics />}
          background="#dcfce7"
          color="#15803d"
        />

        <SummaryCard
          title="Production Rate"
          value={`${productionRate}%`}
          subtitle="Actual vs target"
          icon={<TrendingUp />}
          background="#fef3c7"
          color="#d97706"
        />

        <SummaryCard
          title="Low Production"
          value={lowProduction}
          subtitle="Animals need attention"
          icon={<Warning />}
          background="#fee2e2"
          color="#dc2626"
        />

      </Grid>


      {/* =====================================================
          FILTERS
      ====================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 4,
          boxShadow: "none",
          border:
            "1px solid #e5e7eb",
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
              md={5}
            >

              <TextField
                select
                fullWidth
                label="Select Animal"
                value={selectedAnimal}
                onChange={(e) =>
                  setSelectedAnimal(
                    e.target.value
                  )
                }
              >

                <MenuItem value="ALL">
                  🐾 All Animals
                </MenuItem>

                {animals.map(
                  (animal) => (
                    <MenuItem
                      key={animal.tag}
                      value={animal.tag}
                    >
                      {animal.emoji}{" "}
                      {animal.tag} —{" "}
                      {animal.name}
                    </MenuItem>
                  )
                )}

              </TextField>

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                fullWidth
                type="date"
                label="Production Date"
                value={date}
                onChange={(e) =>
                  setDate(
                    e.target.value
                  )
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={3}
            >

              <Chip
                icon={
                  <CalendarMonth />
                }
                label={`Date: ${date}`}
                sx={{
                  height: 42,
                  fontWeight: 700,
                }}
              />

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* =====================================================
          ALERT
      ====================================================== */}

      {lowProduction > 0 && (

        <Alert
          severity="warning"
          icon={<Warning />}
          sx={{
            mb: 3,
            borderRadius: 3,
            fontWeight: 700,
          }}
        >
          AI detected reduced milk
          production in {lowProduction}
          animal(s). Check health,
          nutrition and activity.
        </Alert>

      )}


      {/* =====================================================
          PRODUCTION TABLE
      ====================================================== */}

      <Typography
        variant="h6"
        fontWeight={900}
        sx={{ mb: 2 }}
      >
        Today's Milk Production
      </Typography>


      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "none",
          border:
            "1px solid #e5e7eb",
          mb: 4,
        }}
      >

        <CardContent>

          {filteredAnimals.map(
            (animal, index) => {

              const total =
                animal.morning +
                animal.evening;

              const percentage =
                Math.min(
                  Math.round(
                    (total /
                      animal.target) *
                      100
                  ),
                  100
                );


              return (
                <Box
                  key={animal.tag}
                >

                  <Box
                    sx={{
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "space-between",
                      gap: 2,
                      flexWrap: "wrap",
                      py: 2,
                    }}
                  >

                    {/* Animal */}

                    <Box
                      sx={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: 1.5,
                        minWidth: 180,
                      }}
                    >

                      <Avatar
                        sx={{
                          width: 52,
                          height: 52,
                          fontSize: 29,
                          backgroundColor:
                            "#dbeafe",
                        }}
                      >
                        {animal.emoji}
                      </Avatar>

                      <Box>

                        <Typography
                          fontWeight={900}
                        >
                          {animal.tag}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {animal.name} •{" "}
                          {animal.breed}
                        </Typography>

                      </Box>

                    </Box>


                    {/* Morning */}

                    <ProductionBox
                      label="Morning"
                      value={`${animal.morning} L`}
                      icon={
                        <AccessTime />
                      }
                      color="#2563eb"
                    />


                    {/* Evening */}

                    <ProductionBox
                      label="Evening"
                      value={`${animal.evening} L`}
                      icon={
                        <AccessTime />
                      }
                      color="#7c3aed"
                    />


                    {/* Total */}

                    <ProductionBox
                      label="Total"
                      value={`${total} L`}
                      icon={
                        <LocalDrink />
                      }
                      color="#059669"
                    />


                    {/* Status */}

                    <Box>

                      <Chip
                        size="small"
                        icon={
                          animal.status ===
                          "Normal"
                            ? <CheckCircle />
                            : <Warning />
                        }
                        label={
                          animal.status
                        }
                        sx={{
                          fontWeight: 800,
                          backgroundColor:
                            animal.status ===
                            "Normal"
                              ? "#dcfce7"
                              : "#fef3c7",
                          color:
                            animal.status ===
                            "Normal"
                              ? "#166534"
                              : "#92400e",
                        }}
                      />

                    </Box>

                  </Box>


                  {/* Progress */}

                  <Box
                    sx={{
                      pl: {
                        xs: 0,
                        md: 8,
                      },
                      pr: 2,
                      pb: 2,
                    }}
                  >

                    <Box
                      sx={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        mb: 0.5,
                      }}
                    >

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Production
                        progress
                      </Typography>

                      <Typography
                        variant="caption"
                        fontWeight={800}
                      >
                        {percentage}% of
                        target
                      </Typography>

                    </Box>


                    <LinearProgress
                      variant="determinate"
                      value={
                        percentage
                      }
                      sx={{
                        height: 7,
                        borderRadius: 5,
                        backgroundColor:
                          "#e5e7eb",

                        "& .MuiLinearProgress-bar":
                          {
                            borderRadius: 5,
                            backgroundColor:
                              percentage >=
                              90
                                ? "#16a34a"
                                : "#f59e0b",
                          },
                      }}
                    />

                  </Box>


                  {index <
                    filteredAnimals.length -
                      1 && (
                    <Divider />
                  )}

                </Box>
              );
            }
          )}

        </CardContent>

      </Card>


      {/* =====================================================
          PRODUCTION ANALYTICS
      ====================================================== */}

      <Grid
        container
        spacing={2.5}
      >

        {/* MORNING VS EVENING */}

        <Grid
          item
          xs={12}
          md={6}
        >

          <Card
            sx={{
              borderRadius: 4,
              height: "100%",
              boxShadow: "none",
              border:
                "1px solid #e5e7eb",
            }}
          >

            <CardContent>

              <Typography
                variant="h6"
                fontWeight={900}
                sx={{ mb: 3 }}
              >
                Morning vs Evening
              </Typography>


              <ProductionComparison
                label="Morning Production"
                value={49}
                target={totalMilk}
                icon={
                  <TrendingUp />
                }
                color="#2563eb"
              />


              <ProductionComparison
                label="Evening Production"
                value={47}
                target={totalMilk}
                icon={
                  <TrendingDown />
                }
                color="#7c3aed"
              />


              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 3,
                  backgroundColor:
                    "#eff6ff",
                }}
              >

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  PRODUCTION INSIGHT
                </Typography>

                <Typography
                  fontWeight={800}
                  sx={{ mt: 0.5 }}
                >
                  Morning production is
                  slightly higher than
                  evening production.
                </Typography>

              </Box>

            </CardContent>

          </Card>

        </Grid>


        {/* AI INSIGHT */}

        <Grid
          item
          xs={12}
          md={6}
        >

          <Card
            sx={{
              borderRadius: 4,
              height: "100%",
              color: "white",
              background:
                "linear-gradient(135deg, #064e3b, #059669)",
            }}
          >

            <CardContent sx={{ p: 3 }}>

              <Box
                sx={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: 2,
                  mb: 3,
                }}
              >

                <Avatar
                  sx={{
                    backgroundColor:
                      "rgba(255,255,255,0.15)",
                  }}
                >
                  🤖
                </Avatar>

                <Box>

                  <Typography
                    variant="h6"
                    fontWeight={900}
                  >
                    AI Milk Prediction
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.8,
                    }}
                  >
                    AgroLens AI analysis
                  </Typography>

                </Box>

              </Box>


              <Typography
                sx={{
                  fontSize: 38,
                  fontWeight: 900,
                }}
              >
                198 L
              </Typography>


              <Typography
                sx={{
                  opacity: 0.8,
                  mb: 3,
                }}
              >
                Predicted production
                for tomorrow
              </Typography>


              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  backgroundColor:
                    "rgba(255,255,255,0.1)",
                }}
              >

                <Typography
                  fontWeight={800}
                >
                  📈 Expected increase:
                  +4.2%
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.75,
                    mt: 0.5,
                  }}
                >
                  Based on recent
                  production, feed intake
                  and animal activity.
                </Typography>

              </Box>

            </CardContent>

          </Card>

        </Grid>

      </Grid>


      {/* =====================================================
          RECORD SECTION
      ====================================================== */}

      <Card
        sx={{
          mt: 4,
          borderRadius: 4,
          boxShadow: "none",
          border:
            "1px solid #e5e7eb",
        }}
      >

        <CardContent>

          <Typography
            variant="h6"
            fontWeight={900}
            sx={{ mb: 3 }}
          >
            Record Milk Production
          </Typography>


          <Grid
            container
            spacing={2}
          >

            <Grid
              item
              xs={12}
              md={3}
            >

              <TextField
                select
                fullWidth
                label="Animal"
                defaultValue="COW001"
              >

                {animals.map(
                  (animal) => (
                    <MenuItem
                      key={animal.tag}
                      value={animal.tag}
                    >
                      {animal.emoji}{" "}
                      {animal.tag}
                    </MenuItem>
                  )
                )}

              </TextField>

            </Grid>


            <Grid
              item
              xs={12}
              md={3}
            >

              <TextField
                fullWidth
                type="number"
                label="Morning Milk (L)"
                defaultValue="14"
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={3}
            >

              <TextField
                fullWidth
                type="number"
                label="Evening Milk (L)"
                defaultValue="14"
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={3}
            >

              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                sx={{
                  height: 56,
                  borderRadius: 2.5,
                  fontWeight: 800,
                  backgroundColor:
                    "#047857",
                  "&:hover": {
                    backgroundColor:
                      "#065f46",
                  },
                }}
              >
                Save Record
              </Button>

            </Grid>

          </Grid>

        </CardContent>

      </Card>

    </Box>
  );
}


/* =====================================================
   SUMMARY CARD
===================================================== */

function SummaryCard({
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
          border:
            "1px solid #e5e7eb",
        }}
      >

        <CardContent>

          <Avatar
            sx={{
              backgroundColor:
                background,
              color: color,
              mb: 2,
            }}
          >
            {icon}
          </Avatar>


          <Typography
            variant="body2"
            color="text.secondary"
          >
            {title}
          </Typography>


          <Typography
            variant="h5"
            fontWeight={900}
            sx={{ mt: 0.3 }}
          >
            {value}
          </Typography>


          <Typography
            variant="caption"
            color="text.secondary"
          >
            {subtitle}
          </Typography>

        </CardContent>

      </Card>

    </Grid>
  );
}


/* =====================================================
   PRODUCTION BOX
===================================================== */

function ProductionBox({
  label,
  value,
  icon,
  color,
}) {

  return (
    <Box
      sx={{
        minWidth: 90,
      }}
    >

      <Box
        sx={{
          display: "flex",
          alignItems:
            "center",
          gap: 0.5,
          color: color,
        }}
      >

        {icon}

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {label}
        </Typography>

      </Box>


      <Typography
        fontWeight={900}
        sx={{
          mt: 0.5,
          color: color,
        }}
      >
        {value}
      </Typography>

    </Box>
  );
}


/* =====================================================
   PRODUCTION COMPARISON
===================================================== */

function ProductionComparison({
  label,
  value,
  target,
  icon,
  color,
}) {

  const percentage =
    Math.round(
      (value / target) * 100
    );


  return (
    <Box sx={{ mb: 3 }}>

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          mb: 1,
        }}
      >

        <Box
          sx={{
            display:
              "flex",
            alignItems:
              "center",
            gap: 1,
          }}
        >

          <Avatar
            sx={{
              width: 34,
              height: 34,
              backgroundColor:
                `${color}20`,
              color: color,
            }}
          >
            {icon}
          </Avatar>

          <Typography
            fontWeight={700}
          >
            {label}
          </Typography>

        </Box>


        <Typography
          fontWeight={900}
          color={color}
        >
          {value} L
        </Typography>

      </Box>


      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 5,
          backgroundColor:
            "#e5e7eb",

          "& .MuiLinearProgress-bar":
            {
              backgroundColor:
                color,
              borderRadius: 5,
            },
        }}
      />

    </Box>
  );
}