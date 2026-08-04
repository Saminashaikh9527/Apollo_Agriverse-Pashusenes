import { useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";

export default function Predictions() {
  const [predictions, setPredictions] = useState([
    {
      id: "P001",
      animalId: "A001",
      prediction: "Milk Yield",
      result: "22 Litres/Day",
      risk: "Low",
      recommendation: "Maintain current feed plan",
    },
    {
      id: "P002",
      animalId: "A002",
      prediction: "Disease Risk",
      result: "High Fever Risk",
      risk: "High",
      recommendation: "Veterinary check required",
    },
    {
      id: "P003",
      animalId: "A003",
      prediction: "Feed Requirement",
      result: "Increase by 10%",
      risk: "Medium",
      recommendation: "Increase protein intake",
    },
  ]);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [newPrediction, setNewPrediction] = useState({
    id: "",
    animalId: "",
    prediction: "",
    result: "",
    risk: "Low",
    recommendation: "",
  });

  const filtered = predictions.filter(
    (item) =>
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.animalId.toLowerCase().includes(search.toLowerCase()) ||
      item.prediction.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (
      !newPrediction.id ||
      !newPrediction.animalId ||
      !newPrediction.prediction ||
      !newPrediction.result ||
      !newPrediction.recommendation
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editing) {
      setPredictions(
        predictions.map((item) =>
          item.id === editing.id ? newPrediction : item
        )
      );
    } else {
      setPredictions([...predictions, newPrediction]);
    }

    setOpen(false);
    setEditing(null);

    setNewPrediction({
      id: "",
      animalId: "",
      prediction: "",
      result: "",
      risk: "Low",
      recommendation: "",
    });
  };

  const handleEdit = (item) => {
    setEditing(item);
    setNewPrediction(item);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this prediction?")) {
      setPredictions(predictions.filter((item) => item.id !== id));
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        AI Predictions
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          label="Search Prediction"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setEditing(null);
            setNewPrediction({
              id: "",
              animalId: "",
              prediction: "",
              result: "",
              risk: "Low",
              recommendation: "",
            });
            setOpen(true);
          }}
        >
          + Add Prediction
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Animal ID</b></TableCell>
              <TableCell><b>Prediction</b></TableCell>
              <TableCell><b>Result</b></TableCell>
              <TableCell><b>Risk</b></TableCell>
              <TableCell><b>Recommendation</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.animalId}</TableCell>
                <TableCell>{item.prediction}</TableCell>
                <TableCell>{item.result}</TableCell>

                <TableCell>
                  <Chip
                    label={item.risk}
                    color={
                      item.risk === "Low"
                        ? "success"
                        : item.risk === "Medium"
                        ? "warning"
                        : "error"
                    }
                  />
                </TableCell>

                <TableCell>{item.recommendation}</TableCell>

                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {editing ? "Edit Prediction" : "Add Prediction"}
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Prediction ID"
            fullWidth
            margin="normal"
            value={newPrediction.id}
            onChange={(e) =>
              setNewPrediction({ ...newPrediction, id: e.target.value })
            }
          />

          <TextField
            label="Animal ID"
            fullWidth
            margin="normal"
            value={newPrediction.animalId}
            onChange={(e) =>
              setNewPrediction({
                ...newPrediction,
                animalId: e.target.value,
              })
            }
          />

          <TextField
            label="Prediction Type"
            fullWidth
            margin="normal"
            value={newPrediction.prediction}
            onChange={(e) =>
              setNewPrediction({
                ...newPrediction,
                prediction: e.target.value,
              })
            }
          />

          <TextField
            label="Prediction Result"
            fullWidth
            margin="normal"
            value={newPrediction.result}
            onChange={(e) =>
              setNewPrediction({
                ...newPrediction,
                result: e.target.value,
              })
            }
          />

          <TextField
            select
            label="Risk Level"
            fullWidth
            margin="normal"
            value={newPrediction.risk}
            onChange={(e) =>
              setNewPrediction({
                ...newPrediction,
                risk: e.target.value,
              })
            }
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>

          <TextField
            label="Recommendation"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={newPrediction.recommendation}
            onChange={(e) =>
              setNewPrediction({
                ...newPrediction,
                recommendation: e.target.value,
              })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}