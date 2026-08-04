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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function Milk() {
  const [milkData, setMilkData] = useState([
    {
      id: "M001",
      animalId: "A001",
      animal: "Cow",
      date: "2026-08-03",
      quantity: 18,
    },
    {
      id: "M002",
      animalId: "A002",
      animal: "Buffalo",
      date: "2026-08-03",
      quantity: 14,
    },
    {
      id: "M003",
      animalId: "A003",
      animal: "Cow",
      date: "2026-08-02",
      quantity: 20,
    },
  ]);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingMilk, setEditingMilk] = useState(null);

  const [newMilk, setNewMilk] = useState({
    id: "",
    animalId: "",
    animal: "",
    date: "",
    quantity: "",
  });

  const filteredMilk = milkData.filter(
    (milk) =>
      milk.id.toLowerCase().includes(search.toLowerCase()) ||
      milk.animalId.toLowerCase().includes(search.toLowerCase()) ||
      milk.animal.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (
      !newMilk.id ||
      !newMilk.animalId ||
      !newMilk.animal ||
      !newMilk.date ||
      !newMilk.quantity
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editingMilk) {
      setMilkData(
        milkData.map((milk) =>
          milk.id === editingMilk.id ? newMilk : milk
        )
      );
    } else {
      setMilkData([...milkData, newMilk]);
    }

    setOpen(false);
    setEditingMilk(null);

    setNewMilk({
      id: "",
      animalId: "",
      animal: "",
      date: "",
      quantity: "",
    });
  };

  const handleEdit = (milk) => {
    setEditingMilk(milk);
    setNewMilk(milk);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this record?")) {
      setMilkData(milkData.filter((milk) => milk.id !== id));
    }
  };

  const totalMilk = milkData.reduce(
    (sum, milk) => sum + Number(milk.quantity),
    0
  );

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Milk Production
      </Typography>

      <Typography
        variant="h6"
        color="success.main"
        mb={2}
      >
        Total Milk Produced : {totalMilk} Litres
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        mb={3}
      >
        <TextField
          label="Search Record"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setEditingMilk(null);
            setNewMilk({
              id: "",
              animalId: "",
              animal: "",
              date: "",
              quantity: "",
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
              <TableCell><b>Record ID</b></TableCell>
              <TableCell><b>Animal ID</b></TableCell>
              <TableCell><b>Animal</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Milk (L)</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredMilk.map((milk) => (
              <TableRow key={milk.id}>
                <TableCell>{milk.id}</TableCell>
                <TableCell>{milk.animalId}</TableCell>
                <TableCell>{milk.animal}</TableCell>
                <TableCell>{milk.date}</TableCell>
                <TableCell>{milk.quantity}</TableCell>

                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleEdit(milk)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(milk.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
      >
        <DialogTitle>
          {editingMilk
            ? "Edit Milk Record"
            : "Add Milk Record"}
        </DialogTitle>

        <DialogContent>

          <TextField
            label="Record ID"
            fullWidth
            margin="normal"
            value={newMilk.id}
            onChange={(e) =>
              setNewMilk({
                ...newMilk,
                id: e.target.value,
              })
            }
          />

          <TextField
            label="Animal ID"
            fullWidth
            margin="normal"
            value={newMilk.animalId}
            onChange={(e) =>
              setNewMilk({
                ...newMilk,
                animalId: e.target.value,
              })
            }
          />

          <TextField
            label="Animal"
            fullWidth
            margin="normal"
            value={newMilk.animal}
            onChange={(e) =>
              setNewMilk({
                ...newMilk,
                animal: e.target.value,
              })
            }
          />

          <TextField
            type="date"
            fullWidth
            margin="normal"
            value={newMilk.date}
            onChange={(e) =>
              setNewMilk({
                ...newMilk,
                date: e.target.value,
              })
            }
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Milk Quantity (L)"
            type="number"
            fullWidth
            margin="normal"
            value={newMilk.quantity}
            onChange={(e) =>
              setNewMilk({
                ...newMilk,
                quantity: e.target.value,
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