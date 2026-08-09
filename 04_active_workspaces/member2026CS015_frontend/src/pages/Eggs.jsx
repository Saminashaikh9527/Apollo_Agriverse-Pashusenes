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
  Egg,
  TrendingUp,
  TrendingDown,
  Pets,
  CalendarMonth,
  Add,
  Warning,
  CheckCircle,
  Analytics,
  Inventory2,
} from "@mui/icons-material";


const flocks = [
  {
    tag: "HEN001",
    name: "Layer Group A",
    breed: "White Leghorn",
    emoji: "🐔",
    birds: 120,
    eggs: 102,
    target: 110,
    broken: 3,
    quality: "Excellent",
    status: "Normal",
  },

  {
    tag: "HEN002",
    name: "Layer Group B",
    breed: "Rhode Island Red",
    emoji: "🐔",
    birds: 100,
    eggs: 81,
    target: 95,
    broken: 2,
    quality: "Good",
    status: "Low Production",
  },

  {
    tag: "HEN003",
    name: "Layer Group C",
    breed: "Australorp",
    emoji: "🐔",
    birds: 80,
    eggs: 73,
    target: 76,
    broken: 1,
    quality: "Excellent",
    status: "Normal",
  },

  {
    tag: "HEN004",
    name: "Layer Group D",
    breed: "Kadaknath",
    emoji: "🐔",
    birds: 60,
    eggs: 51,
    target: 55,
    broken: 1,
    quality: "Good",
    status: "Normal",
  },
];


export default function Eggs() {

  const [selectedFlock, setSelectedFlock] =
    useState("ALL");

  const [date, setDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );


  const filteredFlocks =
    selectedFlock === "ALL"
      ? flocks
      : flocks.filter(
          (flock) =>
            flock.tag === selectedFlock
        );


  const totalBirds =
    flocks.reduce(
      (sum, flock) =>
        sum + flock.birds,
      0
    );


  const totalEggs =
    flocks.reduce(
      (sum, flock) =>
        sum + flock.eggs,
      0
    );


  const totalTarget =
    flocks.reduce(
      (sum, flock) =>
        sum + flock.target,
      0
    );


  const totalBroken =
    flocks.reduce(
      (sum, flock) =>
        sum + flock.broken,
      0
    );


  const productionRate =
    Math.round(
      (totalEggs / totalTarget) * 100
    );


  const lowProduction =
    flocks.filter(
      (flock) =>
        flock.status ===
        "Low Production"
    ).length;


  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#fffaf5",
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
            color="#4a2500"
          >
            Egg Production 🥚
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Monitor poultry production,
            egg quality and flock
            performance.
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
              "#d97706",
            px: 3,
            "&:hover": {
              backgroundColor:
                "#b45309",
            },
          }}
        >
          Add Egg Record
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
          title="Today's Eggs"
          value={totalEggs}
          subtitle="Total eggs collected"
          icon={<Egg />}
          background="#fef3c7"
          color="#d97706"
        />

        <SummaryCard
          title="Egg Target"
          value={totalTarget}
          subtitle="Expected collection"
          icon={<Analytics />}
          background="#dcfce7"
          color="#15803d"
        />

        <SummaryCard
          title="Production Rate"
          value={`${productionRate}%`}
          subtitle="Actual vs target"
          icon={<TrendingUp />}
          background="#dbeafe"
          color="#2563eb"
        />

        <SummaryCard
          title="Broken Eggs"
          value={totalBroken}
          subtitle="Damaged during collection"
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
                label="Select Flock"
                value={selectedFlock}
                onChange={(e) =>
                  setSelectedFlock(
                    e.target.value
                  )
                }
              >

                <MenuItem value="ALL">
                  🐔 All Flocks
                </MenuItem>

                {flocks.map(
                  (flock) => (
                    <MenuItem
                      key={flock.tag}
                      value={flock.tag}
                    >
                      🐔 {flock.tag} —{" "}
                      {flock.name}
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
                label="Collection Date"
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
          Production is below target
          for {lowProduction} flock(s).
          Check feed, water, temperature
          and flock health.
        </Alert>

      )}


      {/* =====================================================
          FLOCK PRODUCTION
      ====================================================== */}

      <Typography
        variant="h6"
        fontWeight={900}
        sx={{ mb: 2 }}
      >
        Flock Production
      </Typography>


      <Grid
        container
        spacing={2.5}
      >

        {filteredFlocks.map(
          (flock) => {

            const percentage =
              Math.min(
                Math.round(
                  (flock.eggs /
                    flock.target) *
                    100
                ),
                100
              );


            const eggRate =
              Math.round(
                (flock.eggs /
                  flock.birds) *
                  100
              );


            return (
              <Grid
                item
                xs={12}
                md={6}
                lg={3}
                key={flock.tag}
              >

                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    boxShadow: "none",
                    border:
                      "1px solid #e5e7eb",
                  }}
                >

                  <CardContent>

                    {/* Flock Header */}

                    <Box
                      sx={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        mb: 2.5,
                      }}
                    >

                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          fontSize: 31,
                          backgroundColor:
                            "#fef3c7",
                        }}
                      >
                        {flock.emoji}
                      </Avatar>


                      <Chip
                        size="small"
                        icon={
                          flock.status ===
                          "Normal"
                            ? <CheckCircle />
                            : <Warning />
                        }
                        label={
                          flock.status
                        }
                        sx={{
                          fontWeight: 800,
                          backgroundColor:
                            flock.status ===
                            "Normal"
                              ? "#dcfce7"
                              : "#fef3c7",
                          color:
                            flock.status ===
                            "Normal"
                              ? "#166534"
                              : "#92400e",
                        }}
                      />

                    </Box>


                    <Typography
                      fontWeight={900}
                    >
                      {flock.tag}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {flock.name}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {flock.breed}
                    </Typography>


                    {/* Egg Count */}

                    <Box
                      sx={{
                        mt: 3,
                        mb: 2,
                        textAlign: "center",
                      }}
                    >

                      <Typography
                        sx={{
                          fontSize: 42,
                          fontWeight: 900,
                          color:
                            "#d97706",
                        }}
                      >
                        {flock.eggs}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        eggs collected
                      </Typography>

                    </Box>


                    {/* Progress */}

                    <Box sx={{ mb: 2 }}>

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
                          fontWeight={700}
                        >
                          Daily Target
                        </Typography>

                        <Typography
                          variant="caption"
                          fontWeight={900}
                        >
                          {flock.eggs}/
                          {flock.target}
                        </Typography>

                      </Box>


                      <LinearProgress
                        variant="determinate"
                        value={
                          percentage
                        }
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          backgroundColor:
                            "#f3f4f6",

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

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {percentage}% of
                        target
                      </Typography>

                    </Box>


                    <Divider
                      sx={{ my: 2 }}
                    />


                    {/* Statistics */}

                    <Grid
                      container
                      spacing={1}
                    >

                      <Stat
                        icon={<Pets />}
                        label="Birds"
                        value={
                          flock.birds
                        }
                      />

                      <Stat
                        icon={<TrendingUp />}
                        label="Lay Rate"
                        value={`${eggRate}%`}
                      />

                      <Stat
                        icon={<Warning />}
                        label="Broken"
                        value={
                          flock.broken
                        }
                      />

                      <Stat
                        icon={<CheckCircle />}
                        label="Quality"
                        value={
                          flock.quality
                        }
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
                        borderColor:
                          "#d97706",
                        color:
                          "#b45309",
                      }}
                    >
                      View Flock Details
                    </Button>

                  </CardContent>

                </Card>

              </Grid>
            );
          }
        )}

      </Grid>


      {/* =====================================================
          ANALYTICS
      ====================================================== */}

      <Grid
        container
        spacing={2.5}
        sx={{ mt: 1 }}
      >

        {/* Production Overview */}

        <Grid
          item
          xs={12}
          md={7}
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
                Egg Production Overview
              </Typography>


              <ProductionRow
                label="Today's Collection"
                value={totalEggs}
                target={totalTarget}
                color="#d97706"
              />


              <ProductionRow
                label="Good Quality Eggs"
                value={
                  totalEggs -
                  totalBroken
                }
                target={totalEggs}
                color="#16a34a"
              />


              <ProductionRow
                label="Broken Eggs"
                value={totalBroken}
                target={totalEggs}
                color="#dc2626"
              />


              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 3,
                  backgroundColor:
                    "#fffbeb",
                }}
              >

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  FLOCK INSIGHT
                </Typography>

                <Typography
                  fontWeight={800}
                  sx={{ mt: 0.5 }}
                >
                  Overall egg production
                  is at {productionRate}%
                  of the expected daily
                  target.
                </Typography>

              </Box>

            </CardContent>

          </Card>

        </Grid>


        {/* AI Prediction */}

        <Grid
          item
          xs={12}
          md={5}
        >

          <Card
            sx={{
              height: "100%",
              borderRadius: 4,
              color: "white",
              background:
                "linear-gradient(135deg, #78350f, #d97706)",
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
                    AI Egg Prediction
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.8,
                    }}
                  >
                    Next-day forecast
                  </Typography>

                </Box>

              </Box>


              <Typography
                sx={{
                  fontSize: 42,
                  fontWeight: 900,
                }}
              >
                315
              </Typography>


              <Typography
                sx={{
                  opacity: 0.8,
                  mb: 3,
                }}
              >
                Expected eggs tomorrow
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
                  📈 Expected change:
                  +3.8%
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.75,
                    mt: 0.5,
                  }}
                >
                  Prediction considers
                  flock age, feed intake,
                  temperature and recent
                  production.
                </Typography>

              </Box>

            </CardContent>

          </Card>

        </Grid>

      </Grid>


      {/* =====================================================
          RECORD ENTRY
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
            Record Egg Collection
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
                label="Flock"
                defaultValue="HEN001"
              >

                {flocks.map(
                  (flock) => (
                    <MenuItem
                      key={flock.tag}
                      value={flock.tag}
                    >
                      🐔 {flock.tag}
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
                label="Eggs Collected"
                defaultValue="100"
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
                label="Broken Eggs"
                defaultValue="2"
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
                    "#d97706",
                  "&:hover": {
                    backgroundColor:
                      "#b45309",
                  },
                }}
              >
                Save Collection
              </Button>

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* =====================================================
          INVENTORY
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

          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 1.5,
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
              <Inventory2 />
            </Avatar>

            <Box>

              <Typography
                variant="h6"
                fontWeight={900}
              >
                Egg Inventory
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Current storage status
              </Typography>

            </Box>

          </Box>


          <Grid
            container
            spacing={2}
          >

            <InventoryCard
              title="Fresh Eggs"
              value="276"
              subtitle="Ready for sale"
              background="#dcfce7"
              color="#15803d"
            />

            <InventoryCard
              title="Packed"
              value="180"
              subtitle="6 trays"
              background="#dbeafe"
              color="#2563eb"
            />

            <InventoryCard
              title="Damaged"
              value="7"
              subtitle="Requires disposal"
              background="#fee2e2"
              color="#dc2626"
            />

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
   STAT
===================================================== */

function Stat({
  icon,
  label,
  value,
}) {

  return (
    <Grid
      item
      xs={6}
    >

      <Box
        sx={{
          p: 1.2,
          borderRadius: 2.5,
          backgroundColor:
            "#fafafa",
        }}
      >

        <Box
          sx={{
            display: "flex",
            alignItems:
              "center",
            gap: 0.5,
            color: "#d97706",
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
          sx={{ mt: 0.3 }}
        >
          {value}
        </Typography>

      </Box>

    </Grid>
  );
}


/* =====================================================
   PRODUCTION ROW
===================================================== */

function ProductionRow({
  label,
  value,
  target,
  color,
}) {

  const percentage =
    target === 0
      ? 0
      : Math.min(
          Math.round(
            (value / target) *
              100
          ),
          100
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

        <Typography
          fontWeight={700}
        >
          {label}
        </Typography>

        <Typography
          fontWeight={900}
          sx={{ color }}
        >
          {value}
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


/* =====================================================
   INVENTORY CARD
===================================================== */

function InventoryCard({
  title,
  value,
  subtitle,
  background,
  color,
}) {

  return (
    <Grid
      item
      xs={12}
      sm={4}
    >

      <Box
        sx={{
          p: 2.5,
          borderRadius: 3,
          backgroundColor:
            background,
        }}
      >

        <Typography
          variant="body2"
          sx={{ color }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 900,
            color,
          }}
        >
          {value}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {subtitle}
        </Typography>

      </Box>

    </Grid>
  );
}