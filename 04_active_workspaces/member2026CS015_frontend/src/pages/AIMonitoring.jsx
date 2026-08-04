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

export default function AIMonitoring() {
  const [records, setRecords] = useState([
    {
      id: "AI001",
      animalId: "A001",
      animal: "Cow",
      temperature: 38.5,
      heartRate: 72,
      activity: "Normal",
      alert: "Healthy",
    },
    {
      id: "AI002",
      animalId: "A002",
      animal: "Buffalo",
      temperature: 40.1,
      heartRate: 95,
      activity: "Low",
      alert: "Warning",
    },
    {
      id: "AI003",
      animalId: "A003",
      animal: "Sheep",
      temperature: 39.0,
      heartRate: 80,
      activity: "High",
      alert: "Healthy",
    },
  ]);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [newRecord, setNewRecord] = useState({
    id: "",
    animalId: "",
    animal: "",
    temperature: "",
    heartRate: "",
    activity: "Normal",
    alert: "Healthy",
  });

  const filtered = records.filter(
    (item) =>
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.animal.toLowerCase().includes(search.toLowerCase()) ||
      item.animalId.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (
      !newRecord.id ||
      !newRecord.animalId ||
      !newRecord.animal ||
      !newRecord.temperature ||
      !newRecord.heartRate
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editing) {
      setRecords(
        records.map((item) =>
          item.id === editing.id ? newRecord : item
        )
      );
    } else {
      setRecords([...records, newRecord]);
    }

    setOpen(false);
    setEditing(null);

    setNewRecord({
      id: "",
      animalId: "",
      animal: "",
      temperature: "",
      heartRate: "",
      activity: "Normal",
      alert: "Healthy",
    });
  };

  const handleEdit = (item) => {
    setEditing(item);
    setNewRecord(item);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this record?")) {
      setRecords(records.filter((item) => item.id !== id));
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        AI Monitoring
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          label="Search Animal"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setEditing(null);
            setNewRecord({
              id: "",
              animalId: "",
              animal: "",
              temperature: "",
              heartRate: "",
              activity: "Normal",
              alert: "Healthy",
            });
            setOpen(true);
          }}
        >
          + Add Record
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Animal</b></TableCell>
              <TableCell><b>Temperature (°C)</b></TableCell>
              <TableCell><b>Heart Rate</b></TableCell>
              <TableCell><b>Activity</b></TableCell>
              <TableCell><b>AI Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.animal}</TableCell>
                <TableCell>{item.temperature}</TableCell>
                <TableCell>{item.heartRate} bpm</TableCell>
                <TableCell>{item.activity}</TableCell>

                <TableCell>
                  <Chip
                    label={item.alert}
                    color={
                      item.alert === "Healthy"
                        ? "success"
                        : item.alert === "Warning"
                        ? "warning"
                        : "error"
                    }
                  />
                </TableCell>

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
          {editing ? "Edit Monitoring Record" : "Add Monitoring Record"}
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Record ID"
            fullWidth
            margin="normal"
            value={newRecord.id}
            onChange={(e) =>
              setNewRecord({ ...newRecord, id: e.target.value })
            }
          />

          <TextField
            label="Animal ID"
            fullWidth
            margin="normal"
            value={newRecord.animalId}
            onChange={(e) =>
              setNewRecord({ ...newRecord, animalId: e.target.value })
            }
          />

          <TextField
            label="Animal"
            fullWidth
            margin="normal"
            value={newRecord.animal}
            onChange={(e) =>
              setNewRecord({ ...newRecord, animal: e.target.value })
            }
          />

          <TextField
            label="Temperature (°C)"
            type="number"
            fullWidth
            margin="normal"
            value={newRecord.temperature}
            onChange={(e) =>
              setNewRecord({ ...newRecord, temperature: e.target.value })
            }
          />

          <TextField
            label="Heart Rate"
            type="number"
            fullWidth
            margin="normal"
            value={newRecord.heartRate}
            onChange={(e) =>
              setNewRecord({ ...newRecord, heartRate: e.target.value })
            }
          />

          <TextField
            select
            label="Activity"
            fullWidth
            margin="normal"
            value={newRecord.activity}
            onChange={(e) =>
              setNewRecord({ ...newRecord, activity: e.target.value })
            }
          >
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>

          <TextField
            select
            label="AI Status"
            fullWidth
            margin="normal"
            value={newRecord.alert}
            onChange={(e) =>
              setNewRecord({ ...newRecord, alert: e.target.value })
            }
          >
            <MenuItem value="Healthy">Healthy</MenuItem>
            <MenuItem value="Warning">Warning</MenuItem>
            <MenuItem value="Critical">Critical</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}