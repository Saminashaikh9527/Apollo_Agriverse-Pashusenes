import {
  Box,
  Typography,
  Grid,
  Paper
} from "@mui/material";


export default function Dashboard() {

  const cards = [
    {
      title: "Farms",
      value: "12"
    },
    {
      title: "Animals",
      value: "256"
    },
    {
      title: "Milk",
      value: "540 L"
    },
    {
      title: "Eggs",
      value: "1240"
    },
    {
      title: "Feed",
      value: "320 Kg"
    },
    {
      title: "AI Alerts",
      value: "5"
    }
  ];


  return (

    <Box
      sx={{
        padding: 4,
        backgroundColor:"#f5f5f5",
        minHeight:"100vh"
      }}
    >

      <Typography
        variant="h3"
        fontWeight="bold"
        mb={1}
      >
        AgroLens PLF Dashboard
      </Typography>


      <Typography
        color="text.secondary"
        mb={4}
      >
        Welcome to Precision Livestock Farming System
      </Typography>


      <Grid container spacing={3}>

        {
          cards.map((card,index)=>(

            <Grid item xs={12} sm={6} md={4} key={index}>

              <Paper
                elevation={4}
                sx={{
                  padding:3,
                  borderRadius:3,
                  textAlign:"center"
                }}
              >

                <Typography
                  variant="h6"
                  color="text.secondary"
                >
                  {card.title}
                </Typography>


                <Typography
                  variant="h3"
                  fontWeight="bold"
                >
                  {card.value}
                </Typography>

              </Paper>

            </Grid>

          ))
        }

      </Grid>


    </Box>

  );
}