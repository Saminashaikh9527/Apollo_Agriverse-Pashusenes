import { useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
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

export default function Reports() {
  const [reports, setReports] = useState([
    {
      id: "R001",
      title: "Daily Milk Report",
      category: "Milk",
      date: "2026-08-03",
      status: "Completed",
    },
    {
      id: "R002",
      title: "Animal Health Report",
      category: "Health",
      date: "2026-08-02",
      status: "Pending",
    },
    {
      id: "R003",
      title: "Feed Consumption",
      category: "Feed",
      date: "2026-08-01",
      status: "Completed",
    },
  ]);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  const [newReport, setNewReport] = useState({
    id: "",
    title: "",
    category: "",
    date: "",
    status: "Completed",
  });

  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(search.toLowerCase()) ||
      report.category.toLowerCase().includes(search.toLowerCase()) ||
      report.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (
      !newReport.id ||
      !newReport.title ||
      !newReport.category ||
      !newReport.date
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editingReport) {
      setReports(
        reports.map((report) =>
          report.id === editingReport.id ? newReport : report
        )
      );
    } else {
      setReports([...reports, newReport]);
    }

    setOpen(false);
    setEditingReport(null);

    setNewReport({
      id: "",
      title: "",
      category: "",
      date: "",
      status: "Completed",
    });
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setNewReport(report);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this report?")) {
      setReports(reports.filter((report) => report.id !== id));
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Reports Dashboard
      </Typography>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Reports</Typography>
              <Typography variant="h4">{reports.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Completed</Typography>
              <Typography variant="h4">
                {reports.filter(r => r.status === "Completed").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending</Typography>
              <Typography variant="h4">
                {reports.filter(r => r.status === "Pending").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Categories</Typography>
              <Typography variant="h4">3</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          label="Search Report"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setEditingReport(null);
            setNewReport({
              id: "",
              title: "",
              category: "",
              date: "",
              status: "Completed",
            });
            setOpen(true);
          }}
        >
          + Add Report
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell><b>Report ID</b></TableCell>
              <TableCell><b>Title</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.id}</TableCell>
                <TableCell>{report.title}</TableCell>
                <TableCell>{report.category}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.status}</TableCell>

                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleEdit(report)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(report.id)}
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
          {editingReport ? "Edit Report" : "Add Report"}
        </DialogTitle>

        <DialogContent>

          <TextField
            label="Report ID"
            fullWidth
            margin="normal"
            value={newReport.id}
            onChange={(e) =>
              setNewReport({ ...newReport, id: e.target.value })
            }
          />

          <TextField
            label="Report Title"
            fullWidth
            margin="normal"
            value={newReport.title}
            onChange={(e) =>
              setNewReport({ ...newReport, title: e.target.value })
            }
          />

          <TextField
            label="Category"
            fullWidth
            margin="normal"
            value={newReport.category}
            onChange={(e) =>
              setNewReport({ ...newReport, category: e.target.value })
            }
          />

          <TextField
            type="date"
            fullWidth
            margin="normal"
            value={newReport.date}
            onChange={(e) =>
              setNewReport({ ...newReport, date: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            select
            label="Status"
            fullWidth
            margin="normal"
            value={newReport.status}
            onChange={(e) =>
              setNewReport({ ...newReport, status: e.target.value })
            }
          >
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
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