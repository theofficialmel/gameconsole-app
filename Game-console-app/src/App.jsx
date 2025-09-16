import { useEffect, useState } from "react";
import "./App.scss";
import {
  createItem,
  listAllItems,
  updateItem,
  deleteItem,
} from "./utils/dynamo";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

function App() {
  const [consoles, setConsoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [consoleToUpdate, setConsoleToUpdate] = useState({
    id: "",
    name: "",
    age: "",
    isInstock: false,
  });

  useEffect(() => {
    (async () => {
      const items = await listAllItems("gameconsole");
      setConsoles(items);
      console.log(items);
    })();
  }, []);

  const handleOpen = (consoleObject) => {
    setConsoleToUpdate(consoleObject);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleUpdateConsole = async (event) => {
    event.preventDefault();

    await updateItem("gameconsole", {
      id: consoleToUpdate.id,
      name: consoleToUpdate.name,
      age: parseInt(consoleToUpdate.age),
      isInstock: consoleToUpdate.isInstock,
    });

    setConsoles((oldConsoles) => {
      return oldConsoles.map((consoleObject) => {
        return consoleObject.id === consoleToUpdate.id
          ? {
              ...consoleObject,
              name: consoleToUpdate.name,
              age: parseInt(consoleToUpdate.age),
              isInstock: consoleToUpdate.isInstock,
            }
          : consoleObject;
      });
    });

    setOpen(false);
  };

  const handleDeleteConsole = async (id, name) => {
    await deleteItem("gameconsole", { id: id, name: name });
    setConsoles((oldConsoles) => {
      return oldConsoles.filter((consoleObject) => {
        return !(consoleObject.id === id && consoleObject.name === name);
      });
    });
  };

  const handleAddConsole = async (event) => {
    event.preventDefault();

    const newConsole = {};

    newConsole.id = Date.now().toString();
    newConsole.name = event.target.consoleName.value;
    newConsole.age = parseInt(event.target.age.value);
    newConsole.isInstock = event.target.isInstock.checked;

    await createItem("gameconsole", newConsole);

    setConsoles((oldConsoles) => {
      return [...oldConsoles, newConsole];
    });
  };

  // id: string, name: string,
  return (
  
  
    <>
      <header>
        <h1>Game Console purchases</h1>
      </header>
      <main>
        <form onSubmit={handleAddConsole}>
          <h2>Console Quantity</h2>
          <label htmlFor="consoleName">Console Name</label>
          <input type="text" name="consoleName" id="consoleName" />
          <br />
          <label htmlFor="age">Age</label>
          <input type="number" name="age" id="age" />
          <br />
          <label htmlFor="isInstock">In Stock</label>
          <input type="checkbox" name="isInstock" id="isInstock" />
          <br />
          <button type="submit">Add Console</button>
        </form>
        

            <section>
              <h2>Console Collection</h2>
              {consoles.length === 0 ? (
                <p>no consoles in stock :</p>
              ) : (
                <div>
                  {consoles.map((consoleObject) => {
                    return (
                      <div key={consoleObject.id}>
                        <p>{consoleObject.name}</p>
                        <p>{consoleObject.age}</p>
                        <p>{consoleObject.isInstock ? "Instock" : "not Instock"}</p>
                        <button onClick={() => handleOpen(consoleObject)}>update console information</button>
                        <button onClick={() => handleDeleteConsole(consoleObject.id, consoleObject.name)}>delete</button>
                      </div>
                    );
                  })}
                </div>
              )}
    
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={{ p: 4, backgroundColor: "white", margin: "auto", mt: 10, width: 400 }}>
                  <form onSubmit={handleUpdateConsole}>
                    <label htmlFor="consoleName">Console Name</label>
                    <input
                      value={consoleToUpdate.name}
                      type="text"
                      name="consoleName"
                      id="consoleName"
                      onChange={(event) =>
                        setConsoleToUpdate({
                          ...consoleToUpdate,
                          name: event.target.value,
                        })
                      }
                    />
                    <br />
                    <label htmlFor="age">Age</label>
                    <input
                      onChange={(event) =>
                        setConsoleToUpdate({
                          ...consoleToUpdate,
                          age: event.target.value,
                        })
                      }
                      value={consoleToUpdate.age}
                      type="number"
                      name="age"
                      id="age"
                    />
                    <br />
                    <div>
                      <label htmlFor="isInstock">In Stock</label>
                      <input
                        onChange={(event) =>
                          setConsoleToUpdate({
                            ...consoleToUpdate,
                            isInstock: event.target.checked,
                          })
                        }
                        checked={consoleToUpdate.isInstock}
                        type="checkbox"
                        name="isInstock"
                        id="isInstock"
                      />
                    </div>
                    <br />
                    <button type="submit">Update Console</button>
                  </form>
                </Box>
              </Modal>
            </section>
          </main>
        </>
