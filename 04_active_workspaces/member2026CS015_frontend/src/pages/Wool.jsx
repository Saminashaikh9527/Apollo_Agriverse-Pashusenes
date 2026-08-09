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
  Divider,
  Alert,
} from "@mui/material";

import {
  ContentCut,
  TrendingUp,
  Scale,
  Pets,
  CalendarMonth,
  Add,
  Warning,
  CheckCircle,
  Inventory2,
  Analytics,
} from "@mui/icons-material";


const flocks = [
  {
    tag: "SHE001",
    name: "Moti",
    breed: "Merino",
    emoji: "🐑",
    sheep: 45,
    wool: 32,
    target: 35,
    quality: "Premium",
    status: "Normal",
    lastShearing: "2026-07-15",
  },

  {
    tag: "SHE002",
    name: "White Flock",
    breed: "Deccani",
    emoji: "🐑",
    sheep: 38,
    wool: 24,
    target: 30,
    quality: "Good",
    status: "Low Yield",
    lastShearing: "2026-07-18",
  },

  {
    tag: "SHE003",
    name: "Brown Flock",
    breed: "Mandya",
    emoji: "🐑",
    sheep: 30,
    wool: 23,
    target: 25,
    quality: "Premium",
    status: "Normal",
    lastShearing: "2026-07-20",
  },

  {
    tag: "SHE004",
    name: "Village Flock",
    breed: "Garole",
    emoji: "🐑",
    sheep: 25,
    wool: 19,
    target: 21,
    quality: "Good",
    status: "Normal",
    lastShearing: "2026-07-22",
  },
];


export default function Wool() {

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


  const totalSheep =
    flocks.reduce(
      (sum, flock) =>
        sum + flock.sheep,
      0
    );


  const totalWool =
    flocks.reduce(
      (sum, flock) =>
        sum + flock.wool,
      0
    );


  const totalTarget =
    flocks.reduce(
      (sum, flock) =>
        sum + flock.target,
      0
    );


  const woolRate =
    Math.round(
      (totalWool / totalTarget) *
        100
    );


  const lowYield =
    flocks.filter(
      (flock) =>
        flock.status ===
        "Low Yield"
    ).length;


  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#faf7ff",
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
            color="#32105c"
          >
            Wool Management 🧶
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Monitor sheep shearing,
            wool production, quality
            and inventory.
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
              "#7c3aed",
            px: 3,
            "&:hover": {
              backgroundColor:
                "#6d28d9",
            },
          }}
        >
          Add Wool Record
        </Button>

      </Box>


      {/* SUMMARY */}

      <Grid
        container
        spacing={2.5}
        sx={{ mb: 4 }}
      >

        <SummaryCard
          title="Wool Collected"
          value={`${totalWool} kg`}
          subtitle="Current production"
          icon={<ContentCut />}
          background="#ede9fe"
          color="#7c3aed"
        />

        <SummaryCard
          title="Target Wool"
          value={`${totalTarget} kg`}
          subtitle="Expected production"
          icon={<Scale />}
          background="#dcfce7"
          color="#15803d"
        />

        <SummaryCard
          title="Production Rate"
          value={`${woolRate}%`}
          subtitle="Actual vs target"
          icon={<TrendingUp />}
          background="#dbeafe"
          color="#2563eb"
        />

        <SummaryCard
          title="Low Yield"
          value={lowYield}
          subtitle="Flocks need attention"
          icon={<Warning />}
          background="#fee2e2"
          color="#dc2626"
        />

      </Grid>


      {/* FILTER */}

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
                  🐑 All Flocks
                </MenuItem>

                {flocks.map(
                  (flock) => (
                    <MenuItem
                      key={flock.tag}
                      value={flock.tag}
                    >
                      🐑 {flock.tag} —{" "}
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
                label="Shearing Date"
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


      {/* ALERT */}

      {lowYield > 0 && (

        <Alert
          severity="warning"
          icon={<Warning />}
          sx={{
            mb: 3,
            borderRadius: 3,
            fontWeight: 700,
          }}
        >
          Wool yield is below the
          expected target for{" "}
          {lowYield} flock(s). Check
          nutrition, sheep health and
          shearing history.
        </Alert>

      )}


      {/* FLOCK CARDS */}

      <Typography
        variant="h6"
        fontWeight={900}
        sx={{ mb: 2 }}
      >
        Flock Wool Production
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
                  (flock.wool /
                    flock.target) *
                    100
                ),
                100
              );


            const woolPerSheep =
              (
                flock.wool /
                flock.sheep
              ).toFixed(2);


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
                            "#ede9fe",
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


                    {/* Wool */}

                    <Box
                      sx={{
                        textAlign: "center",
                        mt: 3,
                        mb: 2,
                      }}
                    >

                      <Typography
                        sx={{
                          fontSize: 40,
                          fontWeight: 900,
                          color:
                            "#7c3aed",
                        }}
                      >
                        {flock.wool}
                        <Typography
                          component="span"
                          fontSize={18}
                          fontWeight={700}
                        >
                          {" "}kg
                        </Typography>
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        wool collected
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
                          Wool Target
                        </Typography>

                        <Typography
                          variant="caption"
                          fontWeight={900}
                        >
                          {flock.wool}/
                          {flock.target} kg
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


                    <Grid
                      container
                      spacing={1}
                    >

                      <Stat
                        icon={<Pets />}
                        label="Sheep"
                        value={
                          flock.sheep
                        }
                      />

                      <Stat
                        icon={<Scale />}
                        label="Per Sheep"
                        value={`${woolPerSheep} kg`}
                      />

                      <Stat
                        icon={
                          <CheckCircle />
                        }
                        label="Quality"
                        value={
                          flock.quality
                        }
                      />

                      <Stat
                        icon={
                          <CalendarMonth />
                        }
                        label="Shearing"
                        value={
                          flock.lastShearing
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
                          "#7c3aed",
                        color:
                          "#7c3aed",
                      }}
                    >
                      View Shearing History
                    </Button>

                  </CardContent>

                </Card>

              </Grid>
            );
          }
        )}

      </Grid>


      {/* ANALYTICS */}

      <Grid
        container
        spacing={2.5}
        sx={{ mt: 1 }}
      >

        <Grid
          item
          xs={12}
          md={7}
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

              <Typography
                variant="h6"
                fontWeight={900}
                sx={{ mb: 3 }}
              >
                Wool Production Analytics
              </Typography>


              <ProductionRow
                label="Wool Collected"
                value={totalWool}
                target={totalTarget}
                color="#7c3aed"
              />


              <ProductionRow
                label="Premium Quality"
                value={54}
                target={totalWool}
                color="#16a34a"
              />


              <ProductionRow
                label="Good Quality"
                value={44}
                target={totalWool}
                color="#2563eb"
              />


              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 3,
                  backgroundColor:
                    "#f5f3ff",
                }}
              >

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  WOOL INSIGHT
                </Typography>

                <Typography
                  fontWeight={800}
                  sx={{ mt: 0.5 }}
                >
                  Overall wool production
                  is currently at{" "}
                  {woolRate}% of the
                  expected target.
                </Typography>

              </Box>

            </CardContent>

          </Card>

        </Grid>


        {/* AI */}

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
                "linear-gradient(135deg, #4c1d95, #7c3aed)",
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
                    AI Wool Prediction
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.8,
                    }}
                  >
                    Next shearing forecast
                  </Typography>

                </Box>

              </Box>


              <Typography
                sx={{
                  fontSize: 40,
                  fontWeight: 900,
                }}
              >
                108 kg
              </Typography>


              <Typography
                sx={{
                  opacity: 0.8,
                  mb: 3,
                }}
              >
                Expected next harvest
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
                  📈 Expected yield:
                  +5.4%
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.75,
                    mt: 0.5,
                  }}
                >
                  Prediction considers
                  sheep age, nutrition,
                  previous wool yield and
                  shearing interval.
                </Typography>

              </Box>

            </CardContent>

          </Card>

        </Grid>

      </Grid>


      {/* RECORD */}

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
            Record Wool Collection
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
                defaultValue="SHE001"
              >

                {flocks.map(
                  (flock) => (
                    <MenuItem
                      key={flock.tag}
                      value={flock.tag}
                    >
                      🐑 {flock.tag}
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
                label="Wool Collected (kg)"
                defaultValue="30"
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={3}
            >

              <TextField
                select
                fullWidth
                label="Wool Quality"
                defaultValue="Premium"
              >

                <MenuItem value="Premium">
                  ⭐ Premium
                </MenuItem>

                <MenuItem value="Good">
                  👍 Good
                </MenuItem>

                <MenuItem value="Average">
                  ◼ Average
                </MenuItem>

              </TextField>

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
                    "#7c3aed",
                  "&:hover": {
                    backgroundColor:
                      "#6d28d9",
                  },
                }}
              >
                Save Record
              </Button>

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* INVENTORY */}

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
                  "#ede9fe",
                color: "#7c3aed",
              }}
            >
              <Inventory2 />
            </Avatar>

            <Box>

              <Typography
                variant="h6"
                fontWeight={900}
              >
                Wool Inventory
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Current wool storage
              </Typography>

            </Box>

          </Box>


          <Grid
            container
            spacing={2}
          >

            <InventoryCard
              title="Premium Wool"
              value="54 kg"
              subtitle="Ready for sale"
              background="#ede9fe"
              color="#7c3aed"
            />

            <InventoryCard
              title="Good Wool"
              value="44 kg"
              subtitle="Stored"
              background="#dbeafe"
              color="#2563eb"
            />

            <InventoryCard
              title="Processing"
              value="10 kg"
              subtitle="Being prepared"
              background="#fef3c7"
              color="#d97706"
            />

          </Grid>

        </CardContent>

      </Card>

    </Box>
  );
}


/* SUMMARY CARD */

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


/* STAT */

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
            color: "#7c3aed",
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


/* PRODUCTION ROW */

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
            (value / target) * 100
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
          {value} kg
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


/* INVENTORY CARD */

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