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
  TextField,
  MenuItem,
  LinearProgress,
  Divider,
  Stack,
  Alert,
} from "@mui/material";

import {
  Pets,
  Favorite,
  MonitorHeart,
  Thermostat,
  LocalDrink,
  Restaurant,
  DirectionsWalk,
  AccessTime,
  Warning,
  CheckCircle,
  TrendingUp,
  CameraAlt,
  Science,
  Vaccines,
} from "@mui/icons-material";

import { useSearchParams } from "react-router-dom";


/* =========================================================
   DIGITAL TWIN DEMO DATA

   Later replace this with data from FastAPI.
========================================================= */

const animals = [
  {
    tag: "COW001",
    name: "Lakshmi",
    species: "Cow",
    breed: "Gir",
    age: "4 years",
    gender: "Female",
    emoji: "🐄",

    health: "Healthy",
    healthScore: 94,

    temperature: 38.5,
    heartRate: 72,

    activity: 88,
    eating: 82,
    resting: 46,
    walking: 74,

    milk: 28,
    feed: 9.2,

    water: 42,

    alert: "No abnormal behaviour detected",

    vaccination: "Up to date",

    lastSeen: "Just now",
  },

  {
    tag: "COW002",
    name: "Ganga",
    species: "Cow",
    breed: "Holstein",
    age: "3 years",
    gender: "Female",
    emoji: "🐄",

    health: "Healthy",
    healthScore: 97,

    temperature: 38.4,
    heartRate: 70,

    activity: 92,
    eating: 89,
    resting: 40,
    walking: 82,

    milk: 31,
    feed: 10.1,

    water: 46,

    alert: "Normal health pattern",

    vaccination: "Up to date",

    lastSeen: "Just now",
  },

  {
    tag: "COW023",
    name: "Kamadhenu",
    species: "Cow",
    breed: "Jersey",
    age: "5 years",
    gender: "Female",
    emoji: "🐄",

    health: "Attention",
    healthScore: 68,

    temperature: 39.4,
    heartRate: 84,

    activity: 58,
    eating: 55,
    resting: 71,
    walking: 42,

    milk: 19,
    feed: 7.5,

    water: 31,

    alert: "Reduced activity detected",

    vaccination: "Due in 12 days",

    lastSeen: "2 min ago",
  },

  {
    tag: "BUF001",
    name: "Nandini",
    species: "Buffalo",
    breed: "Murrah",
    age: "5 years",
    gender: "Female",
    emoji: "🐃",

    health: "Healthy",
    healthScore: 91,

    temperature: 38.7,
    heartRate: 68,

    activity: 84,
    eating: 80,
    resting: 50,
    walking: 71,

    milk: 18,
    feed: 11.2,

    water: 51,

    alert: "Normal health pattern",

    vaccination: "Up to date",

    lastSeen: "Just now",
  },

  {
    tag: "GOAT001",
    name: "Chikki",
    species: "Goat",
    breed: "Jamunapari",
    age: "2 years",
    gender: "Female",
    emoji: "🐐",

    health: "Healthy",
    healthScore: 96,

    temperature: 39.0,
    heartRate: 82,

    activity: 91,
    eating: 86,
    resting: 38,
    walking: 88,

    milk: 2,
    feed: 2.1,

    water: 8,

    alert: "Normal health pattern",

    vaccination: "Up to date",

    lastSeen: "Just now",
  },

  {
    tag: "SHE012",
    name: "Moti",
    species: "Sheep",
    breed: "Deccani",
    age: "3 years",
    gender: "Male",
    emoji: "🐑",

    health: "High Risk",
    healthScore: 41,

    temperature: 40.1,
    heartRate: 96,

    activity: 35,
    eating: 41,
    resting: 82,
    walking: 28,

    milk: 0,
    feed: 1.8,

    water: 5,

    alert: "High temperature + low activity",

    vaccination: "Due",

    lastSeen: "1 min ago",
  },

  {
    tag: "HEN001",
    name: "Ruby",
    species: "Chicken",
    breed: "Rhode Island",
    age: "1 year",
    gender: "Female",
    emoji: "🐔",

    health: "Healthy",
    healthScore: 95,

    temperature: 41.2,
    heartRate: 280,

    activity: 89,
    eating: 84,
    resting: 43,
    walking: 77,

    milk: 0,
    feed: 0.12,

    water: 0.25,

    alert: "Normal health pattern",

    vaccination: "Up to date",

    lastSeen: "Just now",
  },
];


/* =========================================================
   MAIN DIGITAL TWIN
========================================================= */

export default function DigitalTwin() {
  const [searchParams] =
    useSearchParams();

  const animalFromUrl =
    searchParams.get("animal");

  const [selectedTag, setSelectedTag] =
    useState(
      animalFromUrl || "COW001"
    );


  const animal =
    animals.find(
      (item) =>
        item.tag === selectedTag
    ) || animals[0];


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

      {/* =================================================
          HEADER
      ================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",

          alignItems: {
            xs: "flex-start",
            md: "center",
          },

          gap: 2,
          flexWrap: "wrap",
          mb: 3,
        }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight={900}
            color="#12372a"
          >
            Digital Twin 🧬
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Real-time digital representation
            of your livestock.
          </Typography>

        </Box>


        {/* LIVE STATUS */}

        <Chip
          icon={
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor:
                  "#22c55e",
              }}
            />
          }
          label="SYSTEM LIVE"
          sx={{
            fontWeight: 900,
            color: "#166534",
            backgroundColor:
              "#dcfce7",
            px: 1,
          }}
        />

      </Box>


      {/* =================================================
          ANIMAL SELECTOR
      ================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 4,
          border:
            "1px solid #e5e7eb",
          boxShadow: "none",
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
                value={selectedTag}
                onChange={(e) =>
                  setSelectedTag(
                    e.target.value
                  )
                }
              >

                {animals.map(
                  (item) => (
                    <MenuItem
                      key={item.tag}
                      value={item.tag}
                    >
                      {item.emoji}{" "}
                      {item.tag} —{" "}
                      {item.name}
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

                {animals.map(
                  (item) => (
                    <Chip
                      key={item.tag}
                      label={
                        `${item.emoji} ${item.tag}`
                      }
                      onClick={() =>
                        setSelectedTag(
                          item.tag
                        )
                      }
                      variant={
                        selectedTag ===
                        item.tag
                          ? "filled"
                          : "outlined"
                      }
                      sx={{
                        fontWeight: 700,

                        backgroundColor:
                          selectedTag ===
                          item.tag
                            ? "#dcfce7"
                            : "transparent",

                        color:
                          selectedTag ===
                          item.tag
                            ? "#166534"
                            : "inherit",
                      }}
                    />
                  )
                )}

              </Stack>

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* =================================================
          ANIMAL PROFILE
      ================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 4,
          overflow: "hidden",
          border:
            "1px solid #e5e7eb",
          boxShadow: "none",
        }}
      >

        <Box
          sx={{
            background:
              "linear-gradient(135deg, #064e3b, #059669)",
            color: "white",
            p: {
              xs: 2.5,
              md: 3.5,
            },
          }}
        >

          <Grid
            container
            spacing={3}
            alignItems="center"
          >

            {/* ANIMAL */}

            <Grid
              item
              xs={12}
              md={4}
            >

              <Box
                sx={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 2,
                }}
              >

                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: 58,
                    backgroundColor:
                      "rgba(255,255,255,0.15)",
                    border:
                      "3px solid rgba(255,255,255,0.3)",
                  }}
                >
                  {animal.emoji}
                </Avatar>

                <Box>

                  <Typography
                    fontSize={13}
                    sx={{
                      opacity: 0.75,
                    }}
                  >
                    DIGITAL TWIN
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={900}
                  >
                    {animal.tag}
                  </Typography>

                  <Typography>
                    {animal.name} •{" "}
                    {animal.breed}
                  </Typography>

                  <Chip
                    label={
                      animal.health
                    }
                    size="small"
                    sx={{
                      mt: 1,
                      fontWeight: 800,
                      backgroundColor:
                        animal.health ===
                        "Healthy"
                          ? "#bbf7d0"
                          : animal.health ===
                            "Attention"
                          ? "#fed7aa"
                          : "#fecaca",

                      color:
                        animal.health ===
                        "Healthy"
                          ? "#166534"
                          : animal.health ===
                            "Attention"
                          ? "#9a3412"
                          : "#991b1b",
                    }}
                  />

                </Box>

              </Box>

            </Grid>


            {/* HEALTH SCORE */}

            <Grid
              item
              xs={12}
              md={4}
            >

              <Box
                sx={{
                  textAlign: "center",
                }}
              >

                <Typography
                  fontSize={13}
                  sx={{
                    opacity: 0.75,
                  }}
                >
                  AI HEALTH SCORE
                </Typography>

                <Typography
                  sx={{
                    fontSize: 58,
                    fontWeight: 900,
                    lineHeight: 1.1,
                  }}
                >
                  {animal.healthScore}
                </Typography>

                <Typography>
                  out of 100
                </Typography>

              </Box>

            </Grid>


            {/* LIVE */}

            <Grid
              item
              xs={12}
              md={4}
            >

              <Box>

                <Chip
                  label="● LIVE MONITORING"
                  sx={{
                    color: "white",
                    backgroundColor:
                      "rgba(255,255,255,0.15)",
                    fontWeight: 800,
                    mb: 2,
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.8,
                  }}
                >
                  Last detected
                </Typography>

                <Typography
                  fontWeight={800}
                >
                  {animal.lastSeen}
                </Typography>

              </Box>

            </Grid>

          </Grid>

        </Box>


        {/* PROFILE INFO */}

        <CardContent>

          <Grid
            container
            spacing={2}
          >

            <InfoBox
              title="Species"
              value={animal.species}
              icon={<Pets />}
            />

            <InfoBox
              title="Breed"
              value={animal.breed}
              icon={<Science />}
            />

            <InfoBox
              title="Age"
              value={animal.age}
              icon={<AccessTime />}
            />

            <InfoBox
              title="Gender"
              value={animal.gender}
              icon={<Pets />}
            />

          </Grid>

        </CardContent>

      </Card>


      {/* =================================================
          ALERT
      ================================================== */}

      {animal.health !==
        "Healthy" && (

        <Alert
          severity={
            animal.health ===
            "High Risk"
              ? "error"
              : "warning"
          }
          icon={<Warning />}
          sx={{
            mb: 3,
            borderRadius: 3,
            fontWeight: 700,
          }}
        >
          AI Alert: {animal.alert}
        </Alert>

      )}


      {/* =================================================
          HEALTH METRICS
      ================================================== */}

      <Typography
        variant="h6"
        fontWeight={900}
        sx={{ mb: 2 }}
      >
        Live Health Metrics
      </Typography>


      <Grid
        container
        spacing={2.5}
        sx={{ mb: 4 }}
      >

        <MetricCard
          title="Body Temperature"
          value={`${animal.temperature}°C`}
          subtitle="Normal range monitored"
          icon={<Thermostat />}
          color="#ef4444"
          bg="#fee2e2"
          progress={
            animal.temperature >
            39.5
              ? 85
              : 55
          }
        />


        <MetricCard
          title="Heart Rate"
          value={`${animal.heartRate} BPM`}
          subtitle="Live sensor reading"
          icon={<MonitorHeart />}
          color="#ec4899"
          bg="#fce7f3"
          progress={65}
        />


        <MetricCard
          title="Activity"
          value={`${animal.activity}%`}
          subtitle="Movement level"
          icon={<DirectionsWalk />}
          color="#16a34a"
          bg="#dcfce7"
          progress={animal.activity}
        />


        <MetricCard
          title="Water Intake"
          value={`${animal.water} L`}
          subtitle="Today's estimated intake"
          icon={<LocalDrink />}
          color="#2563eb"
          bg="#dbeafe"
          progress={72}
        />

      </Grid>


      {/* =================================================
          BEHAVIOUR + PRODUCTION
      ================================================== */}

      <Grid
        container
        spacing={2.5}
      >

        {/* BEHAVIOUR */}

        <Grid
          item
          xs={12}
          md={6}
        >

          <Card
            sx={{
              borderRadius: 4,
              border:
                "1px solid #e5e7eb",
              boxShadow: "none",
              height: "100%",
            }}
          >

            <CardContent>

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >

                <Typography
                  variant="h6"
                  fontWeight={900}
                >
                  Behaviour Analysis
                </Typography>

                <Chip
                  label="AI Vision"
                  size="small"
                  icon={<CameraAlt />}
                />

              </Box>


              <BehaviourBar
                label="Eating"
                value={animal.eating}
              />

              <BehaviourBar
                label="Walking"
                value={animal.walking}
              />

              <BehaviourBar
                label="Resting"
                value={animal.resting}
              />

              <BehaviourBar
                label="Overall Activity"
                value={animal.activity}
              />


              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 3,
                  backgroundColor:
                    "#f0fdf4",
                }}
              >

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems:
                      "center",
                  }}
                >

                  <CheckCircle
                    sx={{
                      color:
                        "#16a34a",
                    }}
                  />

                  <Typography
                    fontWeight={800}
                  >
                    AI Behaviour Status
                  </Typography>

                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {animal.alert}
                </Typography>

              </Box>

            </CardContent>

          </Card>

        </Grid>


        {/* PRODUCTION */}

        <Grid
          item
          xs={12}
          md={6}
        >

          <Card
            sx={{
              borderRadius: 4,
              border:
                "1px solid #e5e7eb",
              boxShadow: "none",
              height: "100%",
            }}
          >

            <CardContent>

              <Typography
                variant="h6"
                fontWeight={900}
                sx={{ mb: 3 }}
              >
                Production & Consumption
              </Typography>


              <ProductionRow
                icon={<LocalDrink />}
                title="Milk Production"
                value={
                  animal.milk === 0
                    ? "N/A"
                    : `${animal.milk} L`
                }
                color="#2563eb"
              />


              <ProductionRow
                icon={<Restaurant />}
                title="Feed Consumption"
                value={`${animal.feed} kg`}
                color="#84cc16"
              />


              <ProductionRow
                icon={<LocalDrink />}
                title="Water Intake"
                value={`${animal.water} L`}
                color="#06b6d4"
              />


              <ProductionRow
                icon={<Vaccines />}
                title="Vaccination"
                value={animal.vaccination}
                color="#8b5cf6"
              />


              <Divider
                sx={{ my: 2 }}
              />


              <Box
                sx={{
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
                  AI PRODUCTION INSIGHT
                </Typography>

                <Typography
                  fontWeight={800}
                  sx={{ mt: 0.5 }}
                >
                  {animal.milk > 20
                    ? "Production is currently performing within the expected range."
                    : "Production is below the expected range. Increased monitoring is recommended."}
                </Typography>

              </Box>

            </CardContent>

          </Card>

        </Grid>

      </Grid>


      {/* =================================================
          DIGITAL TWIN TIMELINE
      ================================================== */}

      <Card
        sx={{
          mt: 3,
          borderRadius: 4,
          border:
            "1px solid #e5e7eb",
          boxShadow: "none",
        }}
      >

        <CardContent>

          <Typography
            variant="h6"
            fontWeight={900}
            sx={{ mb: 3 }}
          >
            Digital Twin Timeline
          </Typography>


          <TimelineItem
            time="10:42 AM"
            title="Normal activity detected"
            description="Animal movement and behaviour within expected range."
            color="#16a34a"
          />

          <TimelineItem
            time="10:18 AM"
            title="Feed consumption recorded"
            description={`${animal.feed} kg feed consumed.`}
            color="#84cc16"
          />

          <TimelineItem
            time="09:45 AM"
            title="Health sensor updated"
            description={`Temperature ${animal.temperature}°C • Heart rate ${animal.heartRate} BPM`}
            color="#2563eb"
          />

          <TimelineItem
            time="08:30 AM"
            title="AI vision scan completed"
            description="Animal identified and behaviour classification completed."
            color="#8b5cf6"
            last
          />

        </CardContent>

      </Card>

    </Box>
  );
}


/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  title,
  value,
  icon,
}) {
  return (
    <Grid
      item
      xs={6}
      md={3}
    >

      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          backgroundColor:
            "#f8fafc",
        }}
      >

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 0.5,
          }}
        >

          <Box
            sx={{
              color: "#047857",
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
          fontWeight={800}
        >
          {value}
        </Typography>

      </Box>

    </Grid>
  );
}


/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color,
  bg,
  progress,
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
          border:
            "1px solid #e5e7eb",
          boxShadow: "none",
          height: "100%",
        }}
      >

        <CardContent>

          <Avatar
            sx={{
              backgroundColor: bg,
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


          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mt: 2,
              height: 6,
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

        </CardContent>

      </Card>

    </Grid>
  );
}


/* =========================================================
   BEHAVIOUR BAR
========================================================= */

function BehaviourBar({
  label,
  value,
}) {
  return (
    <Box sx={{ mb: 2.5 }}>

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          mb: 0.6,
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
          fontWeight={800}
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
          backgroundColor:
            "#e5e7eb",

          "& .MuiLinearProgress-bar":
            {
              borderRadius: 5,
              background:
                "linear-gradient(90deg, #10b981, #06b6d4)",
            },
        }}
      />

    </Box>
  );
}


/* =========================================================
   PRODUCTION ROW
========================================================= */

function ProductionRow({
  icon,
  title,
  value,
  color,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent:
          "space-between",
        mb: 2,
      }}
    >

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >

        <Avatar
          sx={{
            width: 38,
            height: 38,
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
          {title}
        </Typography>

      </Box>


      <Typography
        fontWeight={900}
        color={color}
      >
        {value}
      </Typography>

    </Box>
  );
}


/* =========================================================
   TIMELINE
========================================================= */

function TimelineItem({
  time,
  title,
  description,
  color,
  last,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        minHeight: last
          ? "auto"
          : 85,
      }}
    >

      <Box
        sx={{
          display: "flex",
          flexDirection:
            "column",
          alignItems: "center",
        }}
      >

        <Box
          sx={{
            width: 13,
            height: 13,
            borderRadius: "50%",
            backgroundColor:
              color,
            boxShadow:
              `0 0 0 5px ${color}20`,
          }}
        />

        {!last && (
          <Box
            sx={{
              width: 2,
              flex: 1,
              backgroundColor:
                "#e5e7eb",
              mt: 1,
            }}
          />
        )}

      </Box>


      <Box sx={{ pb: 2 }}>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {time}
        </Typography>

        <Typography
          fontWeight={800}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {description}
        </Typography>

      </Box>

    </Box>
  );
}