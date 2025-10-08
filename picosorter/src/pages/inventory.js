import { useEffect } from "react";
import Head from "next/head";
import verifyUser from "../utils/utils";
import MenuBar from "../components/menubar";
import { useState } from "react";

export default function Inventory() {
  const [user, setUser] = useState("");
  const [inventory, setInventory] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(document.title);
    var userResult = JSON.parse(verifyUser());
    setUser(userResult.username);
    fetchData();
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    console.log("User logged out");
    window.location.href = "/login";
  };

  async function fetchData() {
    const response = await fetch("http://localhost:3030/api/inventory", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);

    if (response.status !== 200) {
      alert("Error fetching inventory data");
      return;
    }

    if (Array.isArray(data)) {
      setInventory(data);
    } else if (data.inventory && Array.isArray(data.inventory)) {
      setInventory(data.inventory);
    } else {
      console.error("Data is not an array:", data);
      alert("Error: Inventory data is not in the expected format.");
    }
  }

  function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    fetch(`http://localhost:3030/api/inventory/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          fetchData();
        } else {
          alert("Error deleting inventory item");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error deleting inventory item");
      });
  }

  const blobToUrl = (blob) => {
    const arrayBufferView = new Uint8Array(blob.data);
    const blobObject = new Blob([arrayBufferView], { type: "image/png" });
    return URL.createObjectURL(blobObject);
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddItemClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleAddInventorySubmit = async (form) => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch("http://localhost:3030/api/inventory", {
      method: "POST",
      body: formData,
    });

    if (response.status === 200) {
      fetchData();
    } else {
      alert("Error adding inventory item");
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  // Filter inventory based on search term
  const filteredInventory = inventory.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.color?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term) ||
      String(item.id).includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MenuBar
        pageTitle={title}
        user={user}
        handleLogoutClick={handleLogoutClick}
      />
      <Head>
        <title>Inventory</title>
      </Head>
      <main className="flex-1 flex flex-col items-center py-8">
        <div className="flex flex-row items-center mb-4 w-full max-w-6xl space-x-4">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={handleAddItemClick}
          >
            Add Item
          </button>
          <input
            type="text"
            placeholder="Search Inventory"
            className="px-4 py-2 border border-gray-300 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto w-full max-w-6xl">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Color</th>
                <th className="py-2 px-4 text-left">Price</th>
                <th className="py-2 px-4 text-left">Sale</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">Image</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id} className="border-b last:border-none">
                  <td className="py-2 px-4">{item.id}</td>
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.color}</td>
                  <td className="py-2 px-4">{item.price}</td>
                  <td className="py-2 px-4">{item.sale ? "Yes" : "No"}</td>
                  <td className="py-2 px-4">{item.description}</td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={item.quantity}
                      min="0"
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <img
                      src={blobToUrl(item.image)}
                      alt={item.name}
                      width="100"
                      className="rounded shadow"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <button
                      className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-gray-600 text-lg">Welcome to picosorter.</div>
      </main>
      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={handleAddModalClose}
        onSubmit={handleAddInventorySubmit}
      />
    </div>
  );
}

function AddInventoryModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    color: "",
    price: "",
    description: "",
    quantity: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      name: "",
      color: "",
      price: "",
      description: "",
      quantity: "",
      image: null,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">Add Inventory Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            name="color"
            placeholder="Color"
            value={form.color}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { AddInventoryModal };
