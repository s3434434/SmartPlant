import React, { useEffect, useState } from "react";
import "./add_plant.css";
import _ from "lodash";
import axios from "axios";

export default function AddPlant(props) {
  const [form, setForm] = useState({
    plantName: "",
    plantType: "",
    plantImage: null,
  });
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState("none");

  useEffect(() => {
    document.title = "Add plant | Demeter - The plant meter";

    const login = localStorage.getItem("demeter-login");
    if (login) {
      const { token } = JSON.parse(login);

      axios
        .get("https://smart-plant.azurewebsites.net/api/Plants", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((err) => {
          props.logOut();
          window.location.pathname = "/";
        });
    } else {
      window.location.pathname = "/";
    }

    // eslint-disable-next-line
  }, []);

  const getPlantTypes = () => {
    return [
      "Flowering Maple",
      "Chenile Plant",
      "Magic Flower",
      "Sweet Flag",
      "Miniature Sweet Flag",
      "Maidenhair Fern",
      "Crinkle-Leaf Plant",
      "Plover Eggs",
      "Silver Vase",
      "Purplish Coral Berry",
      "Royal Wine Bromeliad",
      "Zebra Basket Vine",
      "Lipstick Vine",
      "Variegated Century Plant",
      "Queen Agave",
      "Chinese Evergreen",
      "Silver King",
      "Silver Queen",
      "Allamanda",
      "Miniature Pouch Flower",
      "Candelabra Plant",
      "Medicine Plant",
      "Brevifolia Aloe",
      "Pineapple",
      "Dwarf Crystal Anthurium",
      "Bird’s Nest Anthurium",
      "Flamingo Flower",
      "Norfolk Island Pine",
      "Ardisia",
      "Plume Asparagus",
      "Foxtail Fern",
      "Sickle Thorn",
      "Cast Iron Plant",
      "Mother Fern",
      "Bird’s Nest Fern",
      "Bishop’s Cap",
      "Ponytail",
      "Cuban Holly",
      "Metallic Leaf Begonia",
      "Rex Begonia",
      "Wax Begonia",
      "Queen’s Tears",
      "Urn Plant",
      "Zebra Plant",
      "Bougainvillea",
      "Schefflera",
      "Dwarf Schefflera",
      "Caladium",
      "Rattlesnake Plant",
      "Peacock Plant",
      "Miniature Maranta",
      "Rose Calathea",
      "Slipperwort",
      "Striped Inch Plant",
      "Bonsai Natal Plum",
      "Boxwood Beauty",
      "Fishtail Palm",
      "Madagascar Periwinkle",
      "Peruvian Apple Cactus",
      "Rosary Vine",
      "Parlor Palm",
      "Bamboo Palm",
      "European Fan Palm",
      "Hindustan Gentian",
      "Variegated Spider Plant",
      "Spider Plant",
      "Areca Palm",
      "Chrysanthemum",
      "Kangaroo Vine",
      "Grape Leaf Ivy",
      "Wax Cissus",
      "Miniature Grape Ivy",
      "Calamondin Orange",
      "Kafir Lily",
      "Croton",
      "Coffee",
      "Coleus",
      "Goldfish Plant",
      "Ti Plant",
      "Jade Plant",
      "Propeller Plant",
      "Arab’s Turban",
      "Toy Cypress",
      "Red Flowering Crassula",
      "Rattlesnake Tail",
      "Crossandra",
      "Dwarf Rose Stripe Star",
      "Stiff Pheasant Leaf",
      "House Holly Fern",
      "Rabbit’s Foot Fern",
      "Exotica Perfection",
      "Spotted Dumb Cane",
      "False Aralia",
      "Janet Craig",
      "Warneckii",
      "Corn Plant",
      "Marginata",
      "Gold Dust Dracaena",
      "Miniature Agave",
      "Silver and Gold Dyckia",
      "Molded Wax",
      "Mexican Snowball",
      "Lace Cactus",
      "Spice Orchid",
      "Orchid Cacti",
      "Golden Pothos",
      "Marble Queen",
      "Flame Violet",
      "Lace-Flower Vine",
      "Scarlet Violet",
      "Blue Euphorbia",
      "Corncob Cactus",
      "Crown-of-Thorns",
      "Poinsettia",
      "Milkbush",
      "Botanical Wonder Plant",
      "Japanese Aralia",
      "Weeping Fig",
      "Mistletoe Ficus",
      "Rubber Plant",
      "Fiddle-Leaf Fig",
      "Dwarf Creeping Fig",
      "Cuban Laurel",
      "Rooting Fig",
      "Dwarf Fiddle-Leaf Fig",
      "Red-Nerved Fittonia",
      "Silver-Nerved Fittonia",
      "Fuchsias",
      "Ox Tongue",
      "Jewel Leaf Plant",
      "Scarlet Star",
      "Striped Torch",
      "Purple Passion",
      "Star Window Plant",
      "Zebra Haworthia",
      "Little Zebra Plant",
      "Clipped Window Plant",
      "Algerian Ivy",
      "English Ivy",
      "Waffle Plant",
      "Chinese Hibiscus",
      "Amaryllis",
      "Belmore Sentry Palm",
      "Kentia Palm",
      "Wax Plant",
      "Sweetheart Hoya",
      "Hyacinth",
      "Busy Lizzie Impatiens",
      "Ixora",
      "Peregrian",
      "Shrimp Plant",
      "Christmas Kalanchoe",
      "Dwarf Purple Kalanchoe",
      "Panda Plant",
      "Turk’s Cap",
      "Powder Puff",
      "Firecracker Plant",
      "Red Nerve Plant",
      "Prayer Plant",
      "Plush Vine",
      "Philodendron Pertusum",
      "Window Leaf",
      "Black Alloplectus",
      "Tricolor Bromeliad",
      "Fingernail Plant",
      "Zonata",
      "Boston Fern",
      "Fluffy Ruffles",
      "Miniature Bird’s Nest",
      "Little Tree Cactus",
      "Irish Mittens",
      "Finger Oxalis",
      "Red Oxalis",
      "Pearly Moonstones",
      "Yellow Shrimp Plant",
      "Ladyslipper Orchids",
      "Devil’s Backbone",
      "House Geranium",
      "Ivy Geranium",
      "Button Fern",
      "Satin Pellionia",
      "Egyptian Star Cluster",
      "Emerald Ripple",
      "Leather Peperomia",
      "Baby Rubber Tree",
      "Fiddle-Leaf Philodendron",
      "Emerald Queen",
      "Florida",
      "Heart-Leaf Philodendron",
      "Selloum",
      "Pigmy Date Palm",
      "Aluminum Plant",
      "Artillery Plant",
      "Staghorn Fern",
      "Swedish Ivy",
      "Candle Plant",
      "Podocarpus",
      "Variegated Balfour Aralia",
      "Ming Aralia",
      "Lady Palm",
      "Azaleas",
      "Red-Spray Ruellia",
      "African Violets",
      "Parva Sansevieria",
      "Birdsnest Sansevieria",
      "Gold-Banded Sansevieria",
      "Strawberry Geranium",
      "Christmas Cactus",
      "Silver Pothos",
      "Showy Sedum",
      "Cow Web Houseleek",
      "Purple Heart",
      "Gloxinia",
      "Baby Tears",
      "Peace Lily",
      "Mauna Loa",
      "Carrion Flower",
      "Cape Primrose",
      "Persian Shield",
      "Nephthytis",
      "Dancing Bulb",
      "Blue-Flowered Torch",
      "Piggyback Plant",
      "Flowering Inch Plant",
      "White Velvet",
      "Flaming Sword",
      "Spineless Yucca",
      "Wandering Jew",
    ]
      .sort()
      .map((plantOption) => {
        return (
          <option key={plantOption} value={plantOption}>
            {plantOption}
          </option>
        );
      });
  };

  const handleChange = (e) => {
    const input = e.target;
    const tempForm = _.cloneDeep(form);

    if (input.name === "plantImage") {
      tempForm[input.name] = input.files[0];
    } else {
      tempForm[input.name] = input.value;
    }

    setForm(tempForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Please wait...");
    setShowStatus(true);

    const login = localStorage.getItem("demeter-login");
    if (login) {
      const { token } = JSON.parse(login);

      axios
        .post("https://smart-plant.azurewebsites.net/api/Plants", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          window.location.pathname = "/plants";
        })
        .catch((err) => {
          const errors = err.response.data.errors;
          let errorMessage = "Server error. Please try again later.";

          if (errors.PlantName !== undefined) {
            errorMessage = errors.PlantName[0];
          } else if (errors["Name Taken"] !== undefined) {
            errorMessage = errors["Name Taken"][0];
          } else if (errors.Limit !== undefined) {
            errorMessage = errors.Limit[0];
          }

          setStatus(errorMessage);
        });
    } else {
      setStatus("You are not logged in.");
      setTimeout(() => {
        window.location.pathname = "/";
      }, 500);
    }
  };

  return (
    <section>
      <h1 className="gold text-center">Add plant</h1>
      <form
        className="w-25 m-auto mt-4 d-none d-lg-block"
        onSubmit={handleSubmit}
      >
        <label className="form-label gold" htmlFor="plantName">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          name="plantName"
          value={form.plantName}
          onChange={handleChange}
          required
        />
        <label className="form-label gold mt-3" htmlFor="plantType">
          Variety
        </label>
        <select
          className="form-control"
          name="plantType"
          onChange={handleChange}
          required
        >
          <option key="default" value="">
            Please select a plant
          </option>
          {getPlantTypes()}
        </select>
        <label className="form-label gold mt-3" htmlFor="plantImage">
          Image
        </label>
        <input
          className="form-control"
          name="plantImage"
          onChange={handleChange}
          type="file"
        ></input>
        {showStatus ? (
          <div className="text-center mt-3">
            <span>{status}</span>
          </div>
        ) : (
          <div className="hidden-field mt-3">
            <span>{status}</span>
          </div>
        )}
        <div className="text-center mt-3">
          <button className="btn btn-primary" type="submit">
            Add plant
          </button>
        </div>
      </form>

      <form className="m-auto mt-4 d-lg-none px-2" onSubmit={handleSubmit}>
        <label className="form-label gold" htmlFor="plantName">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          name="plantName"
          value={form.plantName}
          onChange={handleChange}
          required
        />
        <label className="form-label gold mt-3" htmlFor="plantType">
          Variety
        </label>
        <select
          className="form-control"
          name="plantType"
          onChange={handleChange}
          required
        >
          <option key="default" value="">
            Please select a plant
          </option>
          {getPlantTypes()}
        </select>
        <label className="form-label gold mt-3" htmlFor="plantImage">
          Image
        </label>
        <input
          className="form-control"
          name="plantImage"
          onChange={handleChange}
          type="file"
        ></input>
        {showStatus ? (
          <div className="text-center mt-3">
            <span>{status}</span>
          </div>
        ) : (
          <div className="hidden-field mt-3">
            <span>{status}</span>
          </div>
        )}
        <div className="text-center mt-3">
          <button className="btn btn-primary" type="submit">
            Add plant
          </button>
        </div>
      </form>
    </section>
  );
}
