import { useEffect, useState } from "react";

import SampleForm from "../components/SampleForm";
import SampleList from "../components/SampleList";

function Samples() {

  const [samples, setSamples] = useState(() => {
    const savedSamples = localStorage.getItem("samples");

    return savedSamples
      ? JSON.parse(savedSamples)
      : [];
  });

  const [editingIndex, setEditingIndex] = useState(null);


  useEffect(() => {

    localStorage.setItem(
      "samples",
      JSON.stringify(samples)
    );

  }, [samples]);


  function addOrUpdateSample(sample) {

    if (editingIndex !== null) {

      const updatedSamples = [...samples];

      updatedSamples[editingIndex] = sample;

      setSamples(updatedSamples);

      setEditingIndex(null);

    } else {

      setSamples([
        ...samples,
        sample
      ]);

    }

  }


  function editSample(index) {

    setEditingIndex(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  function deleteSample(index) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this sample?"
      );

    if (!confirmed) {
      return;
    }


    const updatedSamples =
      samples.filter(
        (_, sampleIndex) =>
          sampleIndex !== index
      );


    setSamples(updatedSamples);


    if (editingIndex === index) {
      setEditingIndex(null);
    }

  }


  return (
    <main>

      <h1>Sample Management</h1>

      <p>
        Add, edit and manage research samples.
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