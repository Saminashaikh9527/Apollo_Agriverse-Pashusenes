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
  Restaurant,
  Pets,
  WaterDrop,
  TrendingUp,
  Warning,
  CheckCircle,
  Inventory,
  Grass,
  Scale,
  Add,
} from "@mui/icons-material";


const animals = [
  {
    tag: "COW001",
    name: "Lakshmi",
    species: "Cow",
    emoji: "🐄",
    target: 10,
    consumed: 9.2,
    water: 42,
    status: "Normal",
  },

  {
    tag: "COW002",
    name: "Ganga",
    species: "Cow",
    emoji: "🐄",
    target: 11,
    consumed: 10.1,
    water: 46,
    status: "Normal",
  },

  {
    tag: "COW023",
    name: "Kamadhenu",
    species: "Cow",
    emoji: "🐄",
    target: 10,
    consumed: 7.5,
    water: 31,
    status: "Low Intake",
  },

  {
    tag: "BUF001",
    name: "Nandini",
    species: "Buffalo",
    emoji: "🐃",
    target: 12,
    consumed: 11.2,
    water: 51,
    status: "Normal",
  },

  {
    tag: "GOAT001",
    name: "Chikki",
    species: "Goat",
    emoji: "🐐",
    target: 2.5,
    consumed: 2.1,
    water: 8,
    status: "Normal",
  },

  {
    tag: "SHE012",
    name: "Moti",
    species: "Sheep",
    emoji: "🐑",
    target: 2.2,
    consumed: 1.8,
    water: 5,
    status: "Low Intake",
  },

  {
    tag: "HEN001",
    name: "Ruby",
    species: "Chicken",
    emoji: "🐔",
    target: 0.15,
    consumed: 0.12,
    water: 0.25,
    status: "Normal",
  },
];


export default function Feed() {

  const [selectedAnimal, setSelectedAnimal] =
    useState("ALL");

  const [feedType, setFeedType] =
    useState("Cattle Feed");

  const [quantity, setQuantity] =
    useState("10");


  const filteredAnimals =
    selectedAnimal === "ALL"
      ? animals
      : animals.filter(
          (animal) =>
            animal.tag === selectedAnimal
        );


  const totalFeed =
    animals.reduce(
      (sum, animal) =>
        sum + animal.consumed,
      0
    );


  const totalTarget =
    animals.reduce(
      (sum, animal) =>
        sum + animal.target,
      0
    );


  const feedEfficiency =
    Math.round(
      (totalFeed / totalTarget) * 100
    );


  const lowIntake =
    animals.filter(
      (animal) =>
        animal.status === "Low Intake"
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
            Feed Management 🌱
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Monitor feed consumption,
            nutrition and livestock
            feeding patterns.
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
          Add Feed Record
        </Button>

      </Box>


      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <Grid
        container
        spacing={2.5}
        sx={{ mb: 4 }}
      >

        <SummaryCard
          title="Today's Feed"
          value={`${totalFeed.toFixed(1)} kg`}
          subtitle="Total consumed"
          icon={<Restaurant />}
          background="#dcfce7"
          color="#15803d"
        />

        <SummaryCard
          title="Target Feed"
          value={`${totalTarget.toFixed(1)} kg`}
          subtitle="Daily requirement"
          icon={<Scale />}
          background="#dbeafe"
          color="#2563eb"
        />

        <SummaryCard
          title="Feed Efficiency"
          value={`${feedEfficiency}%`}
          subtitle="Consumption vs target"
          icon={<TrendingUp />}
          background="#fef3c7"
          color="#d97706"
        />

        <SummaryCard
          title="Low Intake"
          value={lowIntake}
          subtitle="Animals need attention"
          icon={<Warning />}
          background="#fee2e2"
          color="#dc2626"
        />

      </Grid>


      {/* =====================================================
          FILTER
      ====================================================== */}

      <Card
        sx={{
          borderRadius: 4,
          mb: 3,
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
              md={7}
            >

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
              >

                <Chip
                  icon={<Grass />}
                  label="Balanced Diet"
                  color="success"
                  variant="outlined"
                />

                <Chip
                  icon={<WaterDrop />}
                  label="Water Monitoring"
                  color="primary"
                  variant="outlined"
                />

                <Chip
                  icon={<CheckCircle />}
                  label="AI Nutrition"
                  color="secondary"
                  variant="outlined"
                />

              </Stack>

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* =====================================================
          ALERT
      ====================================================== */}

      {lowIntake > 0 && (

        <Alert
          severity="warning"
          icon={<Warning />}
          sx={{
            mb: 3,
            borderRadius: 3,
            fontWeight: 700,
          }}
        >
          AI detected reduced feed intake
          in {lowIntake} animal(s). Check
          their health and feeding behaviour.
        </Alert>

      )}


      {/* =====================================================
          ANIMAL FEED CARDS
      ====================================================== */}

      <Typography
        variant="h6"
        fontWeight={900}
        sx={{ mb: 2 }}
      >
        Animal Feed Status
      </Typography>


      <Grid
        container
        spacing={2.5}
      >

        {filteredAnimals.map(
          (animal) => {

            const percentage =
              Math.min(
                Math.round(
                  (animal.consumed /
                    animal.target) *
                    100
                ),
                100
              );


            return (
              <Grid
                item
                xs={12}
                md={6}
                lg={4}
                key={animal.tag}
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

                    {/* Animal Header */}

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        mb: 3,
                      }}
                    >

                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: 1.5,
                        }}
                      >

                        <Avatar
                          sx={{
                            width: 52,
                            height: 52,
                            fontSize: 30,
                            backgroundColor:
                              "#dcfce7",
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
                            {animal.name}
                          </Typography>

                        </Box>

                      </Box>


                      <Chip
                        size="small"
                        label={
                          animal.status
                        }
                        icon={
                          animal.status ===
                          "Normal"
                            ? <CheckCircle />
                            : <Warning />
                        }
                        sx={{
                          fontWeight: 700,
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


                    {/* Consumption */}

                    <Box sx={{ mb: 3 }}>

                      <Box
                        sx={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          mb: 1,
                        }}
                      >

                        <Typography
                          variant="body2"
                          fontWeight={700}
                        >
                          Feed Consumption
                        </Typography>

                        <Typography
                          variant="body2"
                          fontWeight={900}
                        >
                          {animal.consumed} /
                          {" "}
                          {animal.target} kg
                        </Typography>

                      </Box>


                      <LinearProgress
                        variant="determinate"
                        value={
                          percentage
                        }
                        sx={{
                          height: 9,
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
                                  : percentage >=
                                    70
                                  ? "#f59e0b"
                                  : "#ef4444",
                            },
                        }}
                      />

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {percentage}%
                        of daily target
                      </Typography>

                    </Box>


                    <Divider
                      sx={{ mb: 2 }}
                    />


                    {/* Stats */}

                    <Grid
                      container
                      spacing={1.5}
                    >

                      <FeedStat
                        icon={<Restaurant />}
                        title="Consumed"
                        value={`${animal.consumed} kg`}
                      />

                      <FeedStat
                        icon={<Scale />}
                        title="Target"
                        value={`${animal.target} kg`}
                      />

                      <FeedStat
                        icon={<WaterDrop />}
                        title="Water"
                        value={`${animal.water} L`}
                      />

                      <FeedStat
                        icon={<Pets />}
                        title="Species"
                        value={animal.species}
                      />

                    </Grid>


                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{
                        mt: 2.5,
                        borderRadius: 2.5,
                        textTransform:
                          "none",
                        fontWeight: 800,
                      }}
                    >
                      View Feed History
                    </Button>

                  </CardContent>

                </Card>

              </Grid>
            );
          }
        )}

      </Grid>


      {/* =====================================================
          FEED ENTRY
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
            Record New Feed Entry
          </Typography>


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
                label="Feed Type"
                value={feedType}
                onChange={(e) =>
                  setFeedType(
                    e.target.value
                  )
                }
              >

                <MenuItem value="Cattle Feed">
                  🌾 Cattle Feed
                </MenuItem>

                <MenuItem value="Green Fodder">
                  🌱 Green Fodder
                </MenuItem>

                <MenuItem value="Dry Fodder">
                  🌾 Dry Fodder
                </MenuItem>

                <MenuItem value="Mineral Mix">
                  🧂 Mineral Mix
                </MenuItem>

                <MenuItem value="Concentrate">
                  🥣 Concentrate
                </MenuItem>

              </TextField>

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                fullWidth
                type="number"
                label="Quantity (kg)"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value
                  )
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
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
                Record Feed
              </Button>

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* =====================================================
          AI INSIGHT
      ====================================================== */}

      <Card
        sx={{
          mt: 4,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #064e3b, #047857)",
          color: "white",
        }}
      >

        <CardContent sx={{ p: 3 }}>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
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
                AI Nutrition Insight
              </Typography>

              <Typography
                sx={{
                  opacity: 0.85,
                  mt: 0.5,
                }}
              >
                Feed consumption is being
                monitored against animal
                requirements. Animals with
                reduced intake can be
                automatically flagged for
                health investigation.
              </Typography>

            </Box>

          </Box>

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
   FEED STAT
===================================================== */

function FeedStat({
  icon,
  title,
  value,
}) {

  return (
    <Grid
      item
      xs={6}
    >

      <Box
        sx={{
          p: 1.5,
          borderRadius: 2.5,
          backgroundColor:
            "#f8fafc",
        }}
      >

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            mb: 0.5,
          }}
        >

          <Box
            sx={{
              color: "#047857",
              display: "flex",
            }}
          >
            {icon}
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            {title}
          </Typography>

        </Box>


        <Typography
          fontWeight={900}
        >
          {value}
        </Typography>

      </Box>

    </Grid>
  );
}