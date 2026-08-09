import { useMemo, useState } from "react";

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
  InputAdornment,
  MenuItem,
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";

import {
  Pets,
  Search,
  Add,
  Favorite,
  Warning,
  Error as ErrorIcon,
  Visibility,
  Edit,
  Delete,
  LocalDrink,
  MonitorHeart,
  Close,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


/* =========================================================
   SAMPLE ANIMAL DATA
   Later this will come from FastAPI / PostgreSQL
========================================================= */

const initialAnimals = [
  {
    id: 1,
    tag: "COW001",
    name: "Lakshmi",
    species: "Cow",
    breed: "Gir",
    age: "4 years",
    gender: "Female",
    health: "Healthy",
    activity: 88,
    temperature: "38.5°C",
    milk: "28 L",
    emoji: "🐄",
    lastCheck: "Today, 09:20 AM",
  },

  {
    id: 2,
    tag: "COW002",
    name: "Ganga",
    species: "Cow",
    breed: "Holstein",
    age: "3 years",
    gender: "Female",
    health: "Healthy",
    activity: 92,
    temperature: "38.4°C",
    milk: "31 L",
    emoji: "🐄",
    lastCheck: "Today, 08:45 AM",
  },

  {
    id: 3,
    tag: "COW023",
    name: "Kamadhenu",
    species: "Cow",
    breed: "Jersey",
    age: "5 years",
    gender: "Female",
    health: "Attention",
    activity: 58,
    temperature: "39.4°C",
    milk: "19 L",
    emoji: "🐄",
    lastCheck: "12 min ago",
  },

  {
    id: 4,
    tag: "BUF001",
    name: "Nandini",
    species: "Buffalo",
    breed: "Murrah",
    age: "5 years",
    gender: "Female",
    health: "Healthy",
    activity: 84,
    temperature: "38.7°C",
    milk: "18 L",
    emoji: "🐃",
    lastCheck: "Today, 10:10 AM",
  },

  {
    id: 5,
    tag: "BUF004",
    name: "Radha",
    species: "Buffalo",
    breed: "Jaffarabadi",
    age: "6 years",
    gender: "Female",
    health: "Healthy",
    activity: 79,
    temperature: "38.6°C",
    milk: "16 L",
    emoji: "🐃",
    lastCheck: "Today, 09:40 AM",
  },

  {
    id: 6,
    tag: "GOAT001",
    name: "Chikki",
    species: "Goat",
    breed: "Jamunapari",
    age: "2 years",
    gender: "Female",
    health: "Healthy",
    activity: 91,
    temperature: "39.0°C",
    milk: "2 L",
    emoji: "🐐",
    lastCheck: "Today, 08:30 AM",
  },

  {
    id: 7,
    tag: "GOAT003",
    name: "Meena",
    species: "Goat",
    breed: "Boer",
    age: "3 years",
    gender: "Female",
    health: "Healthy",
    activity: 87,
    temperature: "38.9°C",
    milk: "1.8 L",
    emoji: "🐐",
    lastCheck: "Today, 08:20 AM",
  },

  {
    id: 8,
    tag: "SHE012",
    name: "Moti",
    species: "Sheep",
    breed: "Deccani",
    age: "3 years",
    gender: "Male",
    health: "High Risk",
    activity: 35,
    temperature: "40.1°C",
    milk: "—",
    emoji: "🐑",
    lastCheck: "35 min ago",
  },

  {
    id: 9,
    tag: "SHE015",
    name: "Rani",
    species: "Sheep",
    breed: "Marwari",
    age: "2 years",
    gender: "Female",
    health: "Healthy",
    activity: 82,
    temperature: "39.1°C",
    milk: "—",
    emoji: "🐑",
    lastCheck: "Today, 09:05 AM",
  },

  {
    id: 10,
    tag: "HEN001",
    name: "Ruby",
    species: "Chicken",
    breed: "Rhode Island",
    age: "1 year",
    gender: "Female",
    health: "Healthy",
    activity: 89,
    temperature: "41.2°C",
    milk: "—",
    emoji: "🐔",
    lastCheck: "Today, 10:00 AM",
  },

  {
    id: 11,
    tag: "HEN002",
    name: "Goldie",
    species: "Chicken",
    breed: "Leghorn",
    age: "1 year",
    gender: "Female",
    health: "Attention",
    activity: 61,
    temperature: "42.0°C",
    milk: "—",
    emoji: "🐔",
    lastCheck: "1 hour ago",
  },
];


export default function Animals() {
  const navigate = useNavigate();

  const [animals, setAnimals] =
    useState(initialAnimals);

  const [search, setSearch] =
    useState("");

  const [speciesFilter, setSpeciesFilter] =
    useState("All");

  const [healthFilter, setHealthFilter] =
    useState("All");

  const [selectedAnimal, setSelectedAnimal] =
    useState(null);

  const [addOpen, setAddOpen] =
    useState(false);


  /* =====================================================
     FILTER
  ====================================================== */

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {

      const matchesSearch =
        animal.tag
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        animal.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        animal.breed
          .toLowerCase()
          .includes(search.toLowerCase());


      const matchesSpecies =
        speciesFilter === "All" ||
        animal.species === speciesFilter;


      const matchesHealth =
        healthFilter === "All" ||
        animal.health === healthFilter;


      return (
        matchesSearch &&
        matchesSpecies &&
        matchesHealth
      );
    });
  }, [
    animals,
    search,
    speciesFilter,
    healthFilter,
  ]);


  /* =====================================================
     STATISTICS
  ====================================================== */

  const totalAnimals = animals.length;

  const healthyAnimals =
    animals.filter(
      (a) => a.health === "Healthy"
    ).length;

  const attentionAnimals =
    animals.filter(
      (a) => a.health === "Attention"
    ).length;

  const highRiskAnimals =
    animals.filter(
      (a) => a.health === "High Risk"
    ).length;


  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f9f8",
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
          mb: 4,
          flexWrap: "wrap",
        }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight={900}
            color="#12372a"
          >
            Animals 🐄
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage, monitor and track all
            livestock on your farm.
          </Typography>

        </Box>


        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() =>
            setAddOpen(true)
          }
          sx={{
            px: 2.5,
            py: 1.2,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 800,

            background:
              "linear-gradient(135deg, #047857, #10b981)",

            "&:hover": {
              background:
                "linear-gradient(135deg, #065f46, #059669)",
            },
          }}
        >
          Add Animal
        </Button>

      </Box>


      {/* =================================================
          STAT CARDS
      ================================================== */}

      <Grid
        container
        spacing={2.5}
        sx={{ mb: 3 }}
      >

        <Grid item xs={12} sm={6} md={3}>
          <AnimalStat
            icon={<Pets />}
            title="Total Animals"
            value={totalAnimals}
            subtitle="Across all species"
            color="#8b5cf6"
            bg="#ede9fe"
          />
        </Grid>


        <Grid item xs={12} sm={6} md={3}>
          <AnimalStat
            icon={<Favorite />}
            title="Healthy"
            value={healthyAnimals}
            subtitle="Normal health status"
            color="#16a34a"
            bg="#dcfce7"
          />
        </Grid>


        <Grid item xs={12} sm={6} md={3}>
          <AnimalStat
            icon={<Warning />}
            title="Attention"
            value={attentionAnimals}
            subtitle="Needs monitoring"
            color="#ea580c"
            bg="#ffedd5"
          />
        </Grid>


        <Grid item xs={12} sm={6} md={3}>
          <AnimalStat
            icon={<ErrorIcon />}
            title="High Risk"
            value={highRiskAnimals}
            subtitle="Immediate attention"
            color="#dc2626"
            bg="#fee2e2"
          />
        </Grid>

      </Grid>


      {/* =================================================
          SEARCH + FILTERS
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
          >

            <Grid
              item
              xs={12}
              md={6}
            >

              <TextField
                fullWidth
                placeholder="Search by animal tag, name or breed..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search
                        sx={{
                          color:
                            "#9ca3af",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

            </Grid>


            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                select
                fullWidth
                label="Species"
                value={speciesFilter}
                onChange={(e) =>
                  setSpeciesFilter(
                    e.target.value
                  )
                }
              >

                <MenuItem value="All">
                  All Species
                </MenuItem>

                <MenuItem value="Cow">
                  🐄 Cow
                </MenuItem>

                <MenuItem value="Buffalo">
                  🐃 Buffalo
                </MenuItem>

                <MenuItem value="Goat">
                  🐐 Goat
                </MenuItem>

                <MenuItem value="Sheep">
                  🐑 Sheep
                </MenuItem>

                <MenuItem value="Chicken">
                  🐔 Chicken
                </MenuItem>

              </TextField>

            </Grid>


            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                select
                fullWidth
                label="Health Status"
                value={healthFilter}
                onChange={(e) =>
                  setHealthFilter(
                    e.target.value
                  )
                }
              >

                <MenuItem value="All">
                  All Status
                </MenuItem>

                <MenuItem value="Healthy">
                  🟢 Healthy
                </MenuItem>

                <MenuItem value="Attention">
                  🟠 Attention
                </MenuItem>

                <MenuItem value="High Risk">
                  🔴 High Risk
                </MenuItem>

              </TextField>

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* =================================================
          RESULTS HEADER
      ================================================== */}

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
            fontWeight={800}
          >
            Livestock
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Showing {filteredAnimals.length}{" "}
            of {totalAnimals} animals
          </Typography>

        </Box>

      </Box>


      {/* =================================================
          ANIMAL CARDS
      ================================================== */}

      <Grid
        container
        spacing={2.5}
      >

        {filteredAnimals.map(
          (animal) => (
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              xl={3}
              key={animal.id}
            >

              <AnimalCard
                animal={animal}
                onView={() =>
                  setSelectedAnimal(
                    animal
                  )
                }
                onDigitalTwin={() =>
                  navigate(
                    `/digital-twin?animal=${animal.tag}`
                  )
                }
              />

            </Grid>
          )
        )}

      </Grid>


      {/* =================================================
          EMPTY STATE
      ================================================== */}

      {filteredAnimals.length === 0 && (
        <Card
          sx={{
            mt: 3,
            p: 5,
            textAlign: "center",
            borderRadius: 4,
            boxShadow: "none",
          }}
        >

          <Pets
            sx={{
              fontSize: 60,
              color: "#d1d5db",
            }}
          />

          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ mt: 2 }}
          >
            No animals found
          </Typography>

          <Typography
            color="text.secondary"
          >
            Try changing your search
            or filters.
          </Typography>

        </Card>
      )}


      {/* =================================================
          ANIMAL DETAILS DIALOG
      ================================================== */}

      <AnimalDetailsDialog
        animal={selectedAnimal}
        onClose={() =>
          setSelectedAnimal(null)
        }
        onDigitalTwin={() => {
          if (selectedAnimal) {
            navigate(
              `/digital-twin?animal=${selectedAnimal.tag}`
            );
          }
        }}
      />


      {/* =================================================
          ADD ANIMAL DIALOG
      ================================================== */}

      <AddAnimalDialog
        open={addOpen}
        onClose={() =>
          setAddOpen(false)
        }
        onAdd={(newAnimal) => {
          setAnimals((prev) => [
            ...prev,
            {
              ...newAnimal,
              id:
                prev.length + 1,
              emoji:
                newAnimal.species ===
                "Cow"
                  ? "🐄"
                  : newAnimal.species ===
                    "Buffalo"
                  ? "🐃"
                  : newAnimal.species ===
                    "Goat"
                  ? "🐐"
                  : newAnimal.species ===
                    "Sheep"
                  ? "🐑"
                  : "🐔",
            },
          ]);

          setAddOpen(false);
        }}
      />

    </Box>
  );
}


/* =========================================================
   ANIMAL STAT
========================================================= */

function AnimalStat({
  icon,
  title,
  value,
  subtitle,
  color,
  bg,
}) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        border:
          "1px solid #e5e7eb",
        boxShadow: "none",

        transition:
          "all 0.2s ease",

        "&:hover": {
          transform:
            "translateY(-3px)",
          boxShadow:
            "0 12px 25px rgba(0,0,0,0.06)",
        },
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
          variant="h4"
          fontWeight={900}
          color="#12372a"
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
  );
}


/* =========================================================
   ANIMAL CARD
========================================================= */

function AnimalCard({
  animal,
  onView,
  onDigitalTwin,
}) {
  const healthConfig = {
    Healthy: {
      color: "#16a34a",
      bg: "#dcfce7",
      icon: <Favorite fontSize="small" />,
    },

    Attention: {
      color: "#ea580c",
      bg: "#ffedd5",
      icon: <Warning fontSize="small" />,
    },

    "High Risk": {
      color: "#dc2626",
      bg: "#fee2e2",
      icon: <ErrorIcon fontSize="small" />,
    },
  };

  const status =
    healthConfig[animal.health];


  return (
    <Card
      sx={{
        borderRadius: 4,
        border:
          "1px solid #e5e7eb",
        boxShadow: "none",
        height: "100%",

        transition:
          "all 0.2s ease",

        "&:hover": {
          transform:
            "translateY(-4px)",

          boxShadow:
            "0 15px 35px rgba(0,0,0,0.08)",
        },
      }}
    >

      <CardContent sx={{ p: 2.5 }}>

        {/* TOP */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-start",
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
                width: 58,
                height: 58,
                fontSize: 32,
                backgroundColor:
                  "#f8fafc",
                border:
                  "2px solid #f1f5f9",
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
            icon={status.icon}
            label={animal.health}
            size="small"
            sx={{
              color: status.color,
              backgroundColor:
                status.bg,
              fontWeight: 800,
              fontSize: 11,
            }}
          />

        </Box>


        <Divider sx={{ my: 2 }} />


        {/* ANIMAL INFORMATION */}

        <Grid
          container
          spacing={1.5}
        >

          <Grid item xs={6}>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Species
            </Typography>

            <Typography
              fontWeight={700}
              fontSize={14}
            >
              {animal.species}
            </Typography>

          </Grid>


          <Grid item xs={6}>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Breed
            </Typography>

            <Typography
              fontWeight={700}
              fontSize={14}
            >
              {animal.breed}
            </Typography>

          </Grid>


          <Grid item xs={6}>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Age
            </Typography>

            <Typography
              fontWeight={700}
              fontSize={14}
            >
              {animal.age}
            </Typography>

          </Grid>


          <Grid item xs={6}>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Temperature
            </Typography>

            <Typography
              fontWeight={700}
              fontSize={14}
            >
              {animal.temperature}
            </Typography>

          </Grid>

        </Grid>


        {/* ACTIVITY */}

        <Box sx={{ mt: 2.5 }}>

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              mb: 0.5,
            }}
          >

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Activity Level
            </Typography>

            <Typography
              variant="caption"
              fontWeight={800}
            >
              {animal.activity}%
            </Typography>

          </Box>

          <LinearProgress
            variant="determinate"
            value={animal.activity}
            sx={{
              height: 7,
              borderRadius: 5,

              backgroundColor:
                "#e5e7eb",

              "& .MuiLinearProgress-bar":
                {
                  borderRadius: 5,

                  backgroundColor:
                    animal.activity >=
                    75
                      ? "#16a34a"
                      : animal.activity >=
                        50
                      ? "#f59e0b"
                      : "#dc2626",
                },
            }}
          />

        </Box>


        {/* MILK */}

        {animal.milk !== "—" && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems:
                "center",
              gap: 1,
            }}
          >

            <LocalDrink
              sx={{
                fontSize: 18,
                color: "#2563eb",
              }}
            />

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Milk today:
            </Typography>

            <Typography
              fontWeight={800}
              color="#2563eb"
            >
              {animal.milk}
            </Typography>

          </Box>
        )}


        {/* ACTIONS */}

        <Box
          sx={{
            display: "flex",
            gap: 1,
            mt: 2.5,
          }}
        >

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Visibility />}
            onClick={onView}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            View
          </Button>


          <Button
            fullWidth
            variant="contained"
            startIcon={<MonitorHeart />}
            onClick={onDigitalTwin}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,

              background:
                "linear-gradient(135deg, #06b6d4, #2563eb)",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #0891b2, #1d4ed8)",
              },
            }}
          >
            Twin
          </Button>

        </Box>


        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 1.5,
            textAlign: "center",
          }}
        >
          Last checked:{" "}
          {animal.lastCheck}
        </Typography>

      </CardContent>

    </Card>
  );
}


/* =========================================================
   ANIMAL DETAILS DIALOG
========================================================= */

function AnimalDetailsDialog({
  animal,
  onClose,
  onDigitalTwin,
}) {
  if (!animal) {
    return null;
  }

  return (
    <Dialog
      open={Boolean(animal)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >

      <DialogTitle>

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
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
                width: 55,
                height: 55,
                fontSize: 30,
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


          <IconButton
            onClick={onClose}
          >
            <Close />
          </IconButton>

        </Box>

      </DialogTitle>


      <DialogContent>

        <Grid
          container
          spacing={2}
          sx={{ mt: 0.5 }}
        >

          <Detail
            label="Species"
            value={animal.species}
          />

          <Detail
            label="Breed"
            value={animal.breed}
          />

          <Detail
            label="Age"
            value={animal.age}
          />

          <Detail
            label="Gender"
            value={animal.gender}
          />

          <Detail
            label="Temperature"
            value={animal.temperature}
          />

          <Detail
            label="Activity"
            value={`${animal.activity}%`}
          />

          <Detail
            label="Milk Today"
            value={animal.milk}
          />

          <Detail
            label="Last Check"
            value={animal.lastCheck}
          />

        </Grid>


        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 3,
            backgroundColor:
              "#f8fafc",
          }}
        >

          <Typography
            fontWeight={800}
            sx={{ mb: 1 }}
          >
            Health Status
          </Typography>

          <Typography
            color="text.secondary"
            variant="body2"
          >
            {animal.health ===
            "Healthy"
              ? "The animal is currently showing normal health and activity."
              : animal.health ===
                "Attention"
              ? "The animal is showing unusual activity and should be monitored."
              : "This animal requires immediate health inspection."}
          </Typography>

        </Box>

      </DialogContent>


      <DialogActions sx={{ p: 2 }}>

        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
          }}
        >
          Close
        </Button>

        <Button
          variant="contained"
          startIcon={<MonitorHeart />}
          onClick={onDigitalTwin}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 700,
          }}
        >
          Open Digital Twin
        </Button>

      </DialogActions>

    </Dialog>
  );
}


/* =========================================================
   DETAIL
========================================================= */

function Detail({
  label,
  value,
}) {
  return (
    <Grid item xs={6}>

      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          backgroundColor:
            "#f8fafc",
        }}
      >

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {label}
        </Typography>

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
   ADD ANIMAL DIALOG
========================================================= */

function AddAnimalDialog({
  open,
  onClose,
  onAdd,
}) {
  const [tag, setTag] =
    useState("");

  const [name, setName] =
    useState("");

  const [species, setSpecies] =
    useState("Cow");

  const [breed, setBreed] =
    useState("");

  const handleAdd = () => {
    if (!tag || !name || !breed) {
      return;
    }

    onAdd({
      tag,
      name,
      species,
      breed,
      age: "New",
      gender: "Female",
      health: "Healthy",
      activity: 80,
      temperature: "—",
      milk:
        species === "Cow" ||
        species === "Buffalo" ||
        species === "Goat"
          ? "0 L"
          : "—",
      lastCheck: "Just added",
    });

    setTag("");
    setName("");
    setBreed("");
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >

      <DialogTitle
        fontWeight={900}
      >
        Add New Animal 🐄
      </DialogTitle>


      <DialogContent>

        <TextField
          fullWidth
          label="Animal Tag"
          placeholder="Example: COW025"
          value={tag}
          onChange={(e) =>
            setTag(e.target.value)
          }
          sx={{ mt: 1.5 }}
        />


        <TextField
          fullWidth
          label="Animal Name"
          placeholder="Example: Lakshmi"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          sx={{ mt: 2 }}
        />


        <TextField
          select
          fullWidth
          label="Species"
          value={species}
          onChange={(e) =>
            setSpecies(e.target.value)
          }
          sx={{ mt: 2 }}
        >

          <MenuItem value="Cow">
            🐄 Cow
          </MenuItem>

          <MenuItem value="Buffalo">
            🐃 Buffalo
          </MenuItem>

          <MenuItem value="Goat">
            🐐 Goat
          </MenuItem>

          <MenuItem value="Sheep">
            🐑 Sheep
          </MenuItem>

          <MenuItem value="Chicken">
            🐔 Chicken
          </MenuItem>

        </TextField>


        <TextField
          fullWidth
          label="Breed"
          placeholder="Example: Gir"
          value={breed}
          onChange={(e) =>
            setBreed(e.target.value)
          }
          sx={{ mt: 2 }}
        />

      </DialogContent>


      <DialogActions sx={{ p: 2 }}>

        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 700,
          }}
        >
          Add Animal
        </Button>

      </DialogActions>

    </Dialog>
  );
}