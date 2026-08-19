import { useMemo, useState, useEffect } from "react";

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
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  Pets,
  Search,
  Add,
  Favorite,
  Warning,
  Error as ErrorIcon,
  Visibility,
  LocalDrink,
  MonitorHeart,
  Close,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import {
  getAnimals as fetchAnimals,
  createAnimal,
} from "../api/animals";


/* =========================================================
   HELPERS
========================================================= */

function getAnimalEmoji(species) {
  switch (species) {
    case "Cow":
      return "🐄";

    case "Buffalo":
      return "🐃";

    case "Goat":
      return "🐐";

    case "Sheep":
      return "🐑";

    case "Chicken":
      return "🐔";

    default:
      return "🐄";
  }
}


/*
 * Backend animal -> frontend animal
 *
 * Your backend currently uses fields such as:
 * animal_id, tag_number, species, breed, gender,
 * birth_date, weight, status
 *
 * The UI uses:
 * id, tag, name, health, etc.
 */
function normalizeAnimal(animal) {
  const species =
    animal.species ||
    "Unknown";

  const tag =
    animal.tag ||
    animal.tag_number ||
    `ANIMAL-${animal.animal_id || ""}`;

  const health =
    animal.health ||
    animal.health_status ||
    (
      animal.status === "active"
        ? "Healthy"
        : animal.status === "inactive"
        ? "Attention"
        : "Healthy"
    );

  return {
    ...animal,

    id:
      animal.id ??
      animal.animal_id ??
      tag,

    animal_id:
      animal.animal_id ??
      animal.id,

    tag,

    name:
      animal.name ||
      tag,

    species,

    breed:
      animal.breed ||
      "Not specified",

    age:
      animal.age ||
      calculateAge(animal.birth_date),

    gender:
      animal.gender ||
      "Not specified",

    temperature:
      animal.temperature ||
      "—",

    activity:
      Number.isFinite(Number(animal.activity))
        ? Number(animal.activity)
        : 80,

    milk:
      animal.milk ??
      animal.milk_today ??
      "—",

    health,

    lastCheck:
      animal.lastCheck ||
      animal.last_check ||
      "Not available",

    emoji:
      animal.emoji ||
      getAnimalEmoji(species),
  };
}


function calculateAge(birthDate) {
  if (!birthDate) {
    return "—";
  }

  const birth = new Date(birthDate);

  if (Number.isNaN(birth.getTime())) {
    return "—";
  }

  const today = new Date();

  let years =
    today.getFullYear() -
    birth.getFullYear();

  const monthDifference =
    today.getMonth() -
    birth.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < birth.getDate()
    )
  ) {
    years--;
  }

  if (years < 1) {
    return "Under 1 year";
  }

  return `${years} year${years === 1 ? "" : "s"}`;
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Animals() {
  const navigate = useNavigate();

  const [animals, setAnimals] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

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
     FETCH ANIMALS
  ====================================================== */

  useEffect(() => {
    let mounted = true;

    const loadAnimals = async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await fetchAnimals();

        if (!mounted) {
          return;
        }

        const list =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.animals)
            ? data.animals
            : Array.isArray(data?.data)
            ? data.data
            : [];

        setAnimals(
          list.map(normalizeAnimal)
        );
      } catch (err) {
        console.error(
          "Failed to fetch animals:",
          err
        );

        if (mounted) {
          setError(
            "Failed to load animals from the backend."
          );

          setAnimals([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAnimals();

    return () => {
      mounted = false;
    };
  }, []);


  /* =====================================================
     FILTER
     
     IMPORTANT:
     This hook MUST run on every render.
     It cannot be placed after the loading return.
  ====================================================== */

  const filteredAnimals =
    useMemo(() => {
      const searchValue =
        search.trim().toLowerCase();

      return animals.filter(
        (animal) => {
          const tag =
            String(
              animal.tag || ""
            ).toLowerCase();

          const name =
            String(
              animal.name || ""
            ).toLowerCase();

          const breed =
            String(
              animal.breed || ""
            ).toLowerCase();

          const matchesSearch =
            !searchValue ||
            tag.includes(searchValue) ||
            name.includes(searchValue) ||
            breed.includes(searchValue);

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
        }
      );
    }, [
      animals,
      search,
      speciesFilter,
      healthFilter,
    ]);


  /* =====================================================
     STATISTICS
  ====================================================== */

  const totalAnimals =
    animals.length;

  const healthyAnimals =
    animals.filter(
      (animal) =>
        animal.health === "Healthy"
    ).length;

  const attentionAnimals =
    animals.filter(
      (animal) =>
        animal.health === "Attention"
    ).length;

  const highRiskAnimals =
    animals.filter(
      (animal) =>
        animal.health === "High Risk"
    ).length;


  /* =====================================================
     LOADING
     
     This return is AFTER all Hooks.
  ====================================================== */

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }


  /* =====================================================
     MAIN UI
  ====================================================== */

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
          ERROR
      ================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
          onClose={() =>
            setError(null)
          }
        >
          {error}
        </Alert>
      )}


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

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <AnimalStat
            icon={<Pets />}
            title="Total Animals"
            value={totalAnimals}
            subtitle="Across all species"
            color="#8b5cf6"
            bg="#ede9fe"
          />
        </Grid>


        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <AnimalStat
            icon={<Favorite />}
            title="Healthy"
            value={healthyAnimals}
            subtitle="Normal health status"
            color="#16a34a"
            bg="#dcfce7"
          />
        </Grid>


        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <AnimalStat
            icon={<Warning />}
            title="Attention"
            value={attentionAnimals}
            subtitle="Needs monitoring"
            color="#ea580c"
            bg="#ffedd5"
          />
        </Grid>


        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
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

            {/* SEARCH */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <TextField
                fullWidth
                placeholder="Search by animal tag, name or breed..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                slotProps={{
                  input: {
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
                  },
                }}
              />

            </Grid>


            {/* SPECIES */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
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


            {/* HEALTH */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
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
            Showing{" "}
            {filteredAnimals.length}{" "}
            of{" "}
            {totalAnimals} animals
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
              size={{
                xs: 12,
                sm: 6,
                lg: 4,
                xl: 3,
              }}
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
                    `/digital-twin?animal=${encodeURIComponent(
                      animal.tag
                    )}`
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
          DETAILS DIALOG
      ================================================== */}

      <AnimalDetailsDialog
        animal={selectedAnimal}
        onClose={() =>
          setSelectedAnimal(null)
        }
        onDigitalTwin={() => {
          if (selectedAnimal) {
            navigate(
              `/digital-twin?animal=${encodeURIComponent(
                selectedAnimal.tag
              )}`
            );
          }
        }}
      />


      {/* =================================================
          ADD ANIMAL
      ================================================== */}

      <AddAnimalDialog
        open={addOpen}
        onClose={() =>
          setAddOpen(false)
        }
        onAdd={async (newAnimal) => {
          try {
            setError(null);

            /*
             * Try backend first.
             *
             * The API function should receive
             * the backend-compatible object.
             */
            const created =
              await createAnimal({
                tag_number:
                  newAnimal.tag,

                species:
                  newAnimal.species,

                breed:
                  newAnimal.breed,

                gender:
                  newAnimal.gender,

                birth_date:
                  newAnimal.birth_date || null,

                weight:
                  newAnimal.weight || null,
              });

            const normalized =
              normalizeAnimal(
                created || newAnimal
              );

            setAnimals((prev) => [
              ...prev,
              normalized,
            ]);

            setAddOpen(false);

          } catch (err) {
            console.error(
              "Failed to create animal:",
              err
            );

            /*
             * Do NOT silently create fake
             * frontend-only data if backend
             * creation fails.
             */
            setError(
              err?.response?.data?.detail ||
              "Failed to add animal to the backend."
            );
          }
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
        height: "100%",
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
            color,
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
      icon: (
        <Favorite fontSize="small" />
      ),
    },

    Attention: {
      color: "#ea580c",
      bg: "#ffedd5",
      icon: (
        <Warning fontSize="small" />
      ),
    },

    "High Risk": {
      color: "#dc2626",
      bg: "#fee2e2",
      icon: (
        <ErrorIcon fontSize="small" />
      ),
    },
  };

  const status =
    healthConfig[animal.health] ||
    healthConfig.Healthy;


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
            alignItems:
              "flex-start",
            gap: 1,
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 1.5,
              minWidth: 0,
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

            <Box
              sx={{
                minWidth: 0,
              }}
            >

              <Typography
                fontWeight={900}
                noWrap
              >
                {animal.tag}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
              >
                {animal.name}
              </Typography>

            </Box>

          </Box>


          <Chip
            icon={status.icon}
            label={
              animal.health ||
              "Healthy"
            }
            size="small"
            sx={{
              color: status.color,
              backgroundColor:
                status.bg,
              fontWeight: 800,
              fontSize: 11,
              flexShrink: 0,
            }}
          />

        </Box>


        <Divider sx={{ my: 2 }} />


        {/* INFORMATION */}

        <Grid
          container
          spacing={1.5}
        >

          <Grid
            size={{ xs: 6 }}
          >
            <InfoItem
              label="Species"
              value={animal.species}
            />
          </Grid>

          <Grid
            size={{ xs: 6 }}
          >
            <InfoItem
              label="Breed"
              value={animal.breed}
            />
          </Grid>

          <Grid
            size={{ xs: 6 }}
          >
            <InfoItem
              label="Age"
              value={animal.age}
            />
          </Grid>

          <Grid
            size={{ xs: 6 }}
          >
            <InfoItem
              label="Temperature"
              value={animal.temperature}
            />
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
            value={Math.min(
              100,
              Math.max(
                0,
                Number(animal.activity) || 0
              )
            )}
            sx={{
              height: 7,
              borderRadius: 5,
              backgroundColor:
                "#e5e7eb",

              "& .MuiLinearProgress-bar": {
                borderRadius: 5,

                backgroundColor:
                  animal.activity >= 75
                    ? "#16a34a"
                    : animal.activity >= 50
                    ? "#f59e0b"
                    : "#dc2626",
              },
            }}
          />

        </Box>


        {/* MILK */}

        {animal.milk !== "—" &&
          animal.milk !== null &&
          animal.milk !== undefined && (
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
            startIcon={
              <Visibility />
            }
            onClick={onView}
            sx={{
              borderRadius: 2,
              textTransform:
                "none",
              fontWeight: 700,
            }}
          >
            View
          </Button>


          <Button
            fullWidth
            variant="contained"
            startIcon={
              <MonitorHeart />
            }
            onClick={onDigitalTwin}
            sx={{
              borderRadius: 2,
              textTransform:
                "none",
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
            textAlign:
              "center",
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
   INFO ITEM
========================================================= */

function InfoItem({
  label,
  value,
}) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography
        fontWeight={700}
        fontSize={14}
        noWrap
      >
        {value || "—"}
      </Typography>
    </Box>
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
            alignItems:
              "center",
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

          <Grid
            size={{ xs: 6 }}
          >
            <Detail
              label="Species"
              value={animal.species}
            />
          </Grid>

          <Grid
            size={{ xs: 6 }}
          >
            <Detail
              label="Breed"
              value={animal.breed}
            />
          </Grid>

          <Grid
            size={{ xs: 6 }}
          >
            <Detail
              label="Age"
              value={animal.age}
            />
          </Grid>

          <Grid
            size={{ xs: 6 }}
          >
            <Detail
              label="Gender"
              value={animal.gender}
            />
          </Grid>

          <Grid
            size={{ xs: 6 }}
          >
            <Detail
              label="Temperature"
              value={animal.temperature}
            />
          </Grid>

          <Grid
            size={{ xs: 6 }}
          >
            <Detail
              label="Activity"
              value={`${animal.activity}%`}
            />
          </Grid>

          <Grid
            size={{ xs: 6 }}
          >
            <Detail
              label="Milk Today"
              value={animal.milk}
            />
          </Grid>

          <Grid
            size={{ xs: 6 }}
          >
            <Detail
              label="Last Check"
              value={animal.lastCheck}
            />
          </Grid>

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


      <DialogActions
        sx={{ p: 2 }}
      >

        <Button
          onClick={onClose}
          sx={{
            textTransform:
              "none",
          }}
        >
          Close
        </Button>

        <Button
          variant="contained"
          startIcon={
            <MonitorHeart />
          }
          onClick={onDigitalTwin}
          sx={{
            textTransform:
              "none",
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
        {value || "—"}
      </Typography>

    </Box>
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

  const [gender, setGender] =
    useState("Female");

  const [birthDate, setBirthDate] =
    useState("");

  const [weight, setWeight] =
    useState("");


  const [saving, setSaving] =
    useState(false);


  const handleAdd = async () => {
    if (
      !tag.trim() ||
      !name.trim() ||
      !breed.trim()
    ) {
      return;
    }

    try {
      setSaving(true);

      await onAdd({
        tag: tag.trim(),
        name: name.trim(),
        species,
        breed: breed.trim(),
        gender,
        birth_date:
          birthDate || null,
        weight:
          weight
            ? Number(weight)
            : null,
      });

      setTag("");
      setName("");
      setSpecies("Cow");
      setBreed("");
      setGender("Female");
      setBirthDate("");
      setWeight("");

    } finally {
      setSaving(false);
    }
  };


  return (
    <Dialog
      open={open}
      onClose={
        saving
          ? undefined
          : onClose
      }
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
          required
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
          required
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
          required
          label="Breed"
          placeholder="Example: Gir"
          value={breed}
          onChange={(e) =>
            setBreed(e.target.value)
          }
          sx={{ mt: 2 }}
        />


        <TextField
          select
          fullWidth
          label="Gender"
          value={gender}
          onChange={(e) =>
            setGender(e.target.value)
          }
          sx={{ mt: 2 }}
        >

          <MenuItem value="Female">
            Female
          </MenuItem>

          <MenuItem value="Male">
            Male
          </MenuItem>

        </TextField>


        <TextField
          fullWidth
          type="date"
          label="Birth Date"
          value={birthDate}
          onChange={(e) =>
            setBirthDate(
              e.target.value
            )
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          sx={{ mt: 2 }}
        />


        <TextField
          fullWidth
          type="number"
          label="Weight (kg)"
          placeholder="Example: 420"
          value={weight}
          onChange={(e) =>
            setWeight(
              e.target.value
            )
          }
          sx={{ mt: 2 }}
        />

      </DialogContent>


      <DialogActions
        sx={{ p: 2 }}
      >

        <Button
          onClick={onClose}
          disabled={saving}
          sx={{
            textTransform:
              "none",
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={
            saving ||
            !tag.trim() ||
            !name.trim() ||
            !breed.trim()
          }
          sx={{
            textTransform:
              "none",
            borderRadius: 2,
            fontWeight: 700,
            minWidth: 130,
          }}
        >
          {saving ? (
            <CircularProgress
              size={22}
              color="inherit"
            />
          ) : (
            "Add Animal"
          )}
        </Button>

      </DialogActions>

    </Dialog>
  );
}