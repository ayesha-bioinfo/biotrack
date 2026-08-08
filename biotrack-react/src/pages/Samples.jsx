import { useEffect, useState } from "react";

import SampleForm from "../components/SampleForm";
import SampleList from "../components/SampleList";

function Samples() {
  const [samples, setSamples] = useState([]);

  const [editingIndex, setEditingIndex] = useState(null);

  const [loading, setLoading] = useState(true);


  // =========================
  // GET SAMPLES FROM BACKEND
  // =========================

  useEffect(() => {

    fetch("http://localhost:5000/api/samples")

      .then((response) => response.json())

      .then((data) => {

        setSamples(data);

        setLoading(false);

      })

      .catch((error) => {

        console.error(
          "Error loading samples:",
          error
        );

        setLoading(false);

      });

  }, []);


  // =========================
  // ADD SAMPLE TO BACKEND
  // =========================

async function addOrUpdateSample(sample) {

  // UPDATE existing sample
  if (editingIndex !== null) {

    const originalSample = samples[editingIndex];

    try {

      const response = await fetch(
        `http://localhost:5000/api/samples/${originalSample.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(sample)
        }
      );

      if (!response.ok) {
        throw new Error("Could not update sample");
      }

      const data = await response.json();

      const updatedSamples = [...samples];

      updatedSamples[editingIndex] = data.sample;

      setSamples(updatedSamples);

      setEditingIndex(null);

    } catch (error) {

      console.error(
        "Error updating sample:",
        error
      );

      alert("Could not update the sample.");
    }

  }

  // ADD new sample
  else {

    try {

      const response = await fetch(
        "http://localhost:5000/api/samples",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(sample)
        }
      );

      if (!response.ok) {
        throw new Error("Could not add sample");
      }

      const data = await response.json();

      setSamples([
        ...samples,
        data.sample
      ]);

    } catch (error) {

      console.error(
        "Error adding sample:",
        error
      );

      alert("Could not add the sample.");
    }

  }

}

  // =========================
  // EDIT
  // =========================

  function editSample(index) {

    setEditingIndex(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  // =========================
  // DELETE
  // =========================

async function deleteSample(index) {

  const sample = samples[index];

  const confirmed = window.confirm(
    `Delete sample ${sample.id}?`
  );

  if (!confirmed) {
    return;
  }

  try {

    const response = await fetch(
      `http://localhost:5000/api/samples/${sample.id}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error(
        "Could not delete sample"
      );
    }

    const data = await response.json();

    console.log(
      "Delete response:",
      data
    );

    setSamples(
      samples.filter(
        (_, sampleIndex) =>
          sampleIndex !== index
      )
    );

  } catch (error) {

    console.error(
      "Error deleting sample:",
      error
    );

    alert(
      "Could not delete the sample."
    );

  }

}


  // =========================
  // LOADING SCREEN
  // =========================

  if (loading) {

    return (
      <main>

        <h1>Sample Management</h1>

        <p>
          Loading samples from backend...
        </p>

      </main>
    );

  }


  return (
    <main>

      <h1>Sample Management</h1>

      <p>
        Manage samples through the BioTrack REST API.
      </p>


      <SampleForm
        onAddSample={addOrUpdateSample}

        editingSample={
          editingIndex !== null
            ? samples[editingIndex]
            : null
        }
      />


      <SampleList
        samples={samples}

        onEditSample={editSample}

        onDeleteSample={deleteSample}
      />

    </main>
  );
}

export default Samples;