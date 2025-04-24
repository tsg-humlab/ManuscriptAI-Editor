/*
 * The function converts the manuscript data to RDF
 */
export async function convertToRdf(manuscripts){
  try {
    const res = await fetch(`/api/transform`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(manuscripts),
    });

    if(res.ok){


      const turtleString = await res.text();
      console.log("Got RDF (Turtle):", turtleString);
      return turtleString
    }else {
      // Custom message for failed HTTP codes
      if (res.status === 404) throw new Error('404, Not found');
      if (res.status === 500) throw new Error('500, internal server error');
      // For any other server error
      throw new Error(res.status);
  }

  } catch (err) {
    console.error("Error submitting data:", err);
    throw err
  }

}


export async function structureManuscripts(data){
  try {
    const response = await fetch(`/api/send_manuscripts`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });



    if(response.ok) {
      // the structured data is expected here.
      return await response.json();
    }
    else {
      // Custom message for failed HTTP codes
      if (response.status === 404) throw new Error('404, Not found');
      if (response.status === 500) throw new Error('500, internal server error');
      // For any other server error
      throw new Error(response.status);
    }
  } catch (error) {
    console.error(error.message);
    throw error
  }
}

export async function dropClassify({ content, extension }) {
  try {
    const response = await fetch(`/api/drop-classify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, extension }),
    });

    if (!response.ok) {
      if (response.status === 404) throw new Error("404, Not found");
      if (response.status === 500) throw new Error("500, internal server error");
      throw new Error(`HTTP error: ${response.status}`);
    }

    const jsonResult = await response.json();
    // e.g. { "structured_data": [... array of manuscripts ...] }
    return jsonResult;
  } catch (error) {
    console.error("Error in dropClassify request:", error);
    throw error;
  }
}

