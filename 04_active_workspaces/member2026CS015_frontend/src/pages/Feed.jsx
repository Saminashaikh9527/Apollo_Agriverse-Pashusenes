import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import {
  createFeedRecord,
  deleteFeedRecord,
  getFeedRecords,
  updateFeedRecord,
} from "../api/feed";
import { getAnimals } from "../api/animals";

const initialForm = {
  animal_id: "",
  feed_date: "",
  feed_type: "",
  quantity_kg: "",
  cost: "",
  notes: "",
};

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value) {
  const number = Number(value || 0);

  return `₹${number.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export default function Feed() {
  const [feedRecords, setFeedRecords] = useState([]);
  const [animals, setAnimals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    ...initialForm,
    feed_date: getToday(),
  });

  const [search, setSearch] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [error, setError] = useState("");

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((previous) => ({
      ...previous,
      open: false,
    }));
  };

  const loadAnimals = async () => {
    try {
      const data = await getAnimals();

      setAnimals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Animals loading error:", err);

      showMessage(
        err.message || "Unable to load animals.",
        "error"
      );
    }
  };

  const loadFeedRecords = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getFeedRecords();

      setFeedRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Feed loading error:", err);

      setError(err.message || "Unable to load feed records.");

      setFeedRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnimals();
    loadFeedRecords();
  }, []);

  const getAnimal = (animalId) => {
    return animals.find(
      (animal) => Number(animal.animal_id) === Number(animalId)
    );
  };

  const getAnimalLabel = (animalId) => {
    const animal = getAnimal(animalId);

    if (!animal) {
      return `Animal #${animalId}`;
    }

    return `${animal.tag_number} - ${animal.species}`;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddDialog = () => {
    setEditingId(null);

    setForm({
      ...initialForm,
      feed_date: getToday(),
    });

    setDialogOpen(true);
  };

  const openEditDialog = (record) => {
    setEditingId(record.feed_id);

    setForm({
      animal_id: record.animal_id ?? "",
      feed_date: record.feed_date ?? getToday(),
      feed_type: record.feed_type ?? "",
      quantity_kg: record.quantity_kg ?? "",
      cost: record.cost ?? "",
      notes: record.notes ?? "",
    });

    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) {
      return;
    }

    setDialogOpen(false);
    setEditingId(null);

    setForm({
      ...initialForm,
      feed_date: getToday(),
    });
  };

  const validateForm = () => {
    if (!form.animal_id) {
      showMessage("Please select an animal.", "warning");
      return false;
    }

    if (!form.feed_date) {
      showMessage("Please select a feed date.", "warning");
      return false;
    }

    if (!form.feed_type.trim()) {
      showMessage("Please enter feed type.", "warning");
      return false;
    }

    if (
      form.quantity_kg === "" ||
      Number(form.quantity_kg) <= 0
    ) {
      showMessage(
        "Quantity must be greater than 0 kg.",
        "warning"
      );

      return false;
    }

    if (
      form.cost !== "" &&
      Number(form.cost) < 0
    ) {
      showMessage(
        "Cost cannot be negative.",
        "warning"
      );

      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    const payload = {
      animal_id: Number(form.animal_id),
      feed_date: form.feed_date,
      feed_type: form.feed_type.trim(),
      quantity_kg: Number(form.quantity_kg),
      cost:
        form.cost === ""
          ? 0
          : Number(form.cost),
      notes: form.notes.trim(),
    };

    try {
      const isEditing = editingId !== null;
      if (isEditing) await updateFeedRecord(editingId, payload);
      else await createFeedRecord(payload);

      showMessage(
        isEditing
          ? "Feed record updated successfully."
          : "Feed record added successfully.",
        "success"
      );

      closeDialog();
      await loadFeedRecords();
    } catch (err) {
      console.error("Save feed error:", err);

      showMessage(
        err.message || "Unable to save feed record.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (feedId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this feed record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteFeedRecord(feedId);

      showMessage(
        "Feed record deleted successfully.",
        "success"
      );

      await loadFeedRecords();
    } catch (err) {
      console.error("Delete feed error:", err);

      showMessage(
        err.message || "Unable to delete feed record.",
        "error"
      );
    }
  };

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return feedRecords;
    }

    return feedRecords.filter((record) => {
      const animal = getAnimal(record.animal_id);

      const values = [
        record.feed_id,
        record.animal_id,
        record.feed_type,
        record.quantity_kg,
        record.cost,
        record.notes,
        record.feed_date,
        animal?.tag_number,
        animal?.species,
      ];

      return values.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [feedRecords, search, animals]);

  const totalQuantity = useMemo(() => {
    return feedRecords.reduce(
      (total, record) =>
        total + Number(record.quantity_kg || 0),
      0
    );
  }, [feedRecords]);

  const totalCost = useMemo(() => {
    return feedRecords.reduce(
      (total, record) =>
        total + Number(record.cost || 0),
      0
    );
  }, [feedRecords]);

  const averageQuantity = useMemo(() => {
    if (feedRecords.length === 0) {
      return 0;
    }

    return totalQuantity / feedRecords.length;
  }, [feedRecords, totalQuantity]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 0.5 }}
          >
            <RestaurantIcon color="primary" />

            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
            >
              Feed Management
            </Typography>
          </Stack>

          <Typography
            variant="body1"
            color="text.secondary"
          >
            Track animal feed quantity, type and daily feeding costs.
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
        >
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadFeedRecords}
            disabled={loading}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
          >
            Add Feed Record
          </Button>
        </Stack>
      </Box>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={loadFeedRecords}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Feed Records
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ mt: 1 }}
              >
                {feedRecords.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Feed
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ mt: 1 }}
              >
                {totalQuantity.toFixed(2)} kg
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Cost
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ mt: 1 }}
              >
                {formatCurrency(totalCost)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Avg. Quantity
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ mt: 1 }}
              >
                {averageQuantity.toFixed(2)} kg
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Table Card */}
      <Paper
        elevation={1}
        sx={{
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Feed Records
          </Typography>

          <TextField
            size="small"
            label="Search"
            placeholder="Search animal, feed type..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            sx={{
              minWidth: {
                xs: "100%",
                md: 300,
              },
            }}
          />
        </Box>

        <Divider />

        {loading ? (
          <Box
            sx={{
              minHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : filteredRecords.length === 0 ? (
          <Box
            sx={{
              minHeight: 300,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: 3,
            }}
          >
            <RestaurantIcon
              sx={{
                fontSize: 60,
                color: "text.disabled",
                mb: 1,
              }}
            />

            <Typography
              variant="h6"
              color="text.secondary"
            >
              No feed records found
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, mb: 2 }}
            >
              Add your first feed record.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAddDialog}
            >
              Add Feed Record
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>ID</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Animal</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Feed Type</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>Quantity</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>Cost</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Notes</strong>
                  </TableCell>

                  <TableCell align="center">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow
                    key={record.feed_id}
                    hover
                  >
                    <TableCell>
                      #{record.feed_id}
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                        >
                          {getAnimalLabel(record.animal_id)}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Animal ID: {record.animal_id}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {formatDate(record.feed_date)}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={record.feed_type || "-"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="right">
                      {Number(
                        record.quantity_kg || 0
                      ).toFixed(2)}{" "}
                      kg
                    </TableCell>

                    <TableCell align="right">
                      {formatCurrency(record.cost)}
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 250,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={record.notes || ""}
                      >
                        {record.notes || "-"}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                      >
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() =>
                            openEditDialog(record)
                          }
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          color="error"
                          size="small"
                          onClick={() =>
                            handleDelete(record.feed_id)
                          }
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingId !== null
            ? "Edit Feed Record"
            : "Add Feed Record"}

          <IconButton
            onClick={closeDialog}
            disabled={saving}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <DialogContent dividers>
            <Grid
              container
              spacing={2}
            >
              {/* Animal */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Animal"
                  name="animal_id"
                  value={form.animal_id}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <MenuItem value="">
                    Select animal
                  </MenuItem>

                  {animals.map((animal) => (
                    <MenuItem
                      key={animal.animal_id}
                      value={animal.animal_id}
                    >
                      {animal.tag_number} -{" "}
                      {animal.species}{" "}
                      {animal.breed
                        ? `(${animal.breed})`
                        : ""}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Date */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Feed Date"
                  name="feed_date"
                  value={form.feed_date}
                  onChange={handleChange}
                  disabled={saving}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Feed Type */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Feed Type"
                  name="feed_type"
                  value={form.feed_type}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="e.g. Green Fodder"
                />
              </Grid>

              {/* Quantity */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Quantity (kg)"
                  name="quantity_kg"
                  value={form.quantity_kg}
                  onChange={handleChange}
                  disabled={saving}
                  inputProps={{
                    min: 0,
                    step: 0.01,
                  }}
                />
              </Grid>

              {/* Cost */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Cost (₹)"
                  name="cost"
                  value={form.cost}
                  onChange={handleChange}
                  disabled={saving}
                  inputProps={{
                    min: 0,
                    step: 0.01,
                  }}
                />
              </Grid>

              {/* Notes */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Additional feeding notes..."
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={closeDialog}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={
                saving ? (
                  <CircularProgress
                    size={18}
                    color="inherit"
                  />
                ) : (
                  <AddIcon />
                )
              }
            >
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Update Record"
                  : "Save Record"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
