import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";


import {
  Dashboard,
  Agriculture,
  Pets,
  Grass,
  LocalDrink,
  Egg,
  ContentCut,
  Assessment,
  SmartToy,
  Psychology,
  Settings
} from "@mui/icons-material";


import { Link } from "react-router-dom";


const menuItems = [
  {
    name:"Dashboard",
    path:"/dashboard",
    icon:<Dashboard/>
  },
  {
    name:"Farms",
    path:"/farms",
    icon:<Agriculture/>
  },
  {
    name:"Animals",
    path:"/animals",
    icon:<Pets/>
  },
  {
    name:"Feed",
    path:"/feed",
    icon:<Grass/>
  },
  {
    name:"Milk",
    path:"/milk",
    icon:<LocalDrink/>
  },
  {
    name:"Eggs",
    path:"/eggs",
    icon:<Egg/>
  },
  {
    name:"Wool",
    path:"/wool",
    icon:<ContentCut/>
  },
  {
    name:"Reports",
    path:"/reports",
    icon:<Assessment/>
  },
  {
    name:"AI Monitoring",
    path:"/ai-monitoring",
    icon:<SmartToy/>
  },
  {
    name:"Predictions",
    path:"/predictions",
    icon:<Psychology/>
  },
  {
    name:"Settings",
    path:"/settings",
    icon:<Settings/>
  }
];


export default function Sidebar(){

  return (

    <Drawer
      variant="permanent"
      sx={{
        width:250,

        "& .MuiDrawer-paper":{
          width:250,
          backgroundColor:"#1b5e20",
          color:"white"
        }
      }}
    >

      <Toolbar>

        <Typography
          variant="h6"
          fontWeight="bold"
        >
          🌱 AgroLens PLF
        </Typography>

      </Toolbar>


      <List>

        {
          menuItems.map((item)=>(

            <ListItem
              key={item.name}
              disablePadding
            >

              <ListItemButton
                component={Link}
                to={item.path}
              >

                <ListItemIcon
                  sx={{
                    color:"white"
                  }}
                >
                  {item.icon}
                </ListItemIcon>


                <ListItemText
                  primary={item.name}
                />

              </ListItemButton>

            </ListItem>

          ))
        }

      </List>


    </Drawer>

  );
}