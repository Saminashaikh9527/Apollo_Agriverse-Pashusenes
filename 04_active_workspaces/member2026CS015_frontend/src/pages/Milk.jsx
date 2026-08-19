import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  Delete,
  LocalDrink,
  Refresh,
} from "@mui/icons-material";

import {
  getMilkRecords,
  createMilkRecord,
  deleteMilkRecord,
} from "../api/backend";

export default function Milk() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getToday = () =>
    new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    animal_id: "",
    production_date: getToday(),
    morning_litres: "",
    evening_litres: "",
  });

  // =====================================================
  // LOAD MILK RECORDS
  // =====================================================

  const loadMilk = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMilkRecords();

      console.log("Milk records:", response);

      const data = Array.isArray(response)
        ? response
        : response?.data ||
          response?.records ||
          [];

      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Milk loading error:", err);

      setError(
        err?.message ||
          "Failed to load milk records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMilk();
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // CREATE MILK RECORD
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!form.animal_id) {
        throw new Error("Animal ID is required.");
      }

      if (!form.production_date) {
        throw new Error(
          "Production date is required."
        );
      }

      const morning =
        Number(form.morning_litres) || 0;

      const evening =
        Number(form.evening_litres) || 0;

      if (morning < 0 || evening < 0) {
        throw new Error(
          "Milk quantity cannot be negative."
        );
      }

      const payload = {
        animal_id: Number(form.animal_id),
        production_date: form.production_date,
        morning_litres: morning,
        evening_litres: evening,
        total_litres: morning + evening,
      };

      console.log(
        "Creating milk record:",
        payload
      );

      await createMilkRecord(payload);

      setForm({
        animal_id: "",
        production_date: getToday(),
        morning_litres: "",
        evening_litres: "",
      });

      await loadMilk();
    } catch (err) {
      console.error(
        "Create milk record error:",
        err
      );

      setError(
        err?.message ||
          "Failed to create milk record."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE MILK RECORD
  // =====================================================

  const handleDelete = async (id) => {
    if (!id) {
      setError("Invalid milk record ID.");
      return;
    }

    const confirmed = window.confirm(
      "Delete this milk record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteMilkRecord(id);

      await loadMilk();
    } catch (err) {
      console.error(
        "Delete milk record error:",
        err
      );

      setError(
        err?.message ||
          "Failed to delete milk record."
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        maxWidth: 1600,
        mx: "auto",
      }}
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: "#064e3b",
            }}
          >
            Milk Production
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Track daily milk production for your
            livestock.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadMilk}
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 700,
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* =================================================
          ERROR
      ================================================== */}

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
        >
          {error}
        </Alert>
      )}

      {/* =================================================
          ADD RECORD
      ================================================== */}

      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          mb: 4,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
            }}
          >
            <LocalDrink color="primary" />

            <Typography
              variant="h6"
              fontWeight={800}
            >
              Add Milk Record
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(5, 1fr)",
              },
              gap: 2,
            }}
          >
            {/* ANIMAL ID */}

            <TextField
              label="Animal ID"
              name="animal_id"
              type="number"
              value={form.animal_id}
              onChange={handleChange}
              required
              slotProps={{
                htmlInput: {
                  min: 1,
                  step: 1,
                },
              }}
            />

            {/* PRODUCTION DATE */}

            <TextField
              label="Production Date"
              name="production_date"
              type="date"
              value={form.production_date}
              onChange={handleChange}
              required
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            {/* MORNING */}

            <TextField
              label="Morning Litres"
              name="morning_litres"
              type="number"
              value={form.morning_litres}
              onChange={handleChange}
              required
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: 0.1,
                },
              }}
            />

            {/* EVENING */}

            <TextField
              label="Evening Litres"
              name="evening_litres"
              type="number"
              value={form.evening_litres}
              onChange={handleChange}
              required
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: 0.1,
                },
              }}
            />

            {/* SUBMIT */}

            <Button
              type="submit"
              variant="contained"
              startIcon={
                saving ? (
                  <CircularProgress
                    size={20}
                    color="inherit"
                  />
                ) : (
                  <Add />
                )
              }
              disabled={saving}
              sx={{
                minHeight: 56,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 800,
              }}
            >
              {saving
                ? "Saving..."
                : "Add Record"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* =================================================
          RECORDS
      ================================================== */}

      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid #e2e8f0",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ mb: 2 }}
          >
            Milk Records
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* LOADING */}

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 6,
              }}
            >
              <CircularProgress />
            </Box>
          ) : records.length === 0 ? (
            /* EMPTY */

            <Box
              sx={{
                textAlign: "center",
                py: 6,
              }}
            >
              <LocalDrink
                sx={{
                  fontSize: 55,
                  color: "#cbd5e1",
                }}
              />

              <Typography
                color="text.secondary"
                fontWeight={600}
              >
                No milk records found.
              </Typography>
            </Box>
          ) : (
            /* RECORD GRID */

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              {records.map((record) => {
                const recordId =
                  record?.milk_id ??
                  record?.id;

                return (
                  <Card
                    key={recordId}
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border:
                        "1px solid #e2e8f0",
                      backgroundColor:
                        "#f8fafc",
                    }}
                  >
                    <CardContent>
                      {/* HEADER */}

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
                            fontWeight={800}
                          >
                            Animal #
                            {record?.animal_id ??
                              "—"}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {record?.production_date ??
                              "—"}
                          </Typography>
                        </Box>

                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDelete(
                              recordId
                            )
                          }
                          disabled={!recordId}
                        >
                          <Delete />
                        </IconButton>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* VALUES */}

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(3, 1fr)",
                          gap: 1,
                        }}
                      >
                        {/* MORNING */}

                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Morning
                          </Typography>

                          <Typography
                            fontWeight={800}
                          >
                            {record?.morning_litres ??
                              0}{" "}
                            L
                          </Typography>
                        </Box>

                        {/* EVENING */}

                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Evening
                          </Typography>

                          <Typography
                            fontWeight={800}
                          >
                            {record?.evening_litres ??
                              0}{" "}
                            L
                          </Typography>
                        </Box>

                        {/* TOTAL */}

                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Total
                          </Typography>

                          <Typography
                            fontWeight={900}
                            color="primary"
                          >
                            {record?.total_litres ??
                              0}{" "}
                            L
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}