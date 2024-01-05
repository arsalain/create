
"use client"
import { useState } from 'react';
// You can use a form library like Formik or React Hook Form, but here we'll use plain state management

const page = () => {
  const [trekData, setTrekData] = useState({
    name: '',
    testimage: null,
    testimagealt:'',
    urllink:'',
    amount: '',
    maintype: '',
    statetype: '',
    state: '',
for: '',
fromamount: '',
reserveamount: '',
day: '',
trektype: '',
trektypename: '',
level: '',
levelname: '',
service: '',
servicename: '',
statename: '',
expertpara: '',
expectpara: '',
expecthead1: '',
expecthead1para: '',
expecthead2: '',
expecthead2para: '',
itinerary: '',
    days: [
      { day: '', cityName: '', description: [''], meals: '', imagealt: '', image:null }
    ],
    over:[],
    included: [],
    notincluded: [],
    things: [],
    relatedtreks:[],
    batch: [{ date: '', amount: '' }],
    // ... initialize other array fields similarly
  });
console.log(trekData,"trek")
  // Handle change for string fields
  const handleChange = (e) => {
    setTrekData({ ...trekData, [e.target.name]: e.target.value });
  };

  // Handle change for array fields like 'days'
  const handleDayChange = (index, e) => {
    const updatedDays = [...trekData.days];
    updatedDays[index] = { ...updatedDays[index], [e.target.name]: e.target.value };
    setTrekData({ ...trekData, days: updatedDays });
  };
  const handleDescriptionChange = (dayIndex, descIndex, e) => {
    const newDays = [...trekData.days];
    newDays[dayIndex].description[descIndex] = e.target.value;
    setTrekData({ ...trekData, days: newDays });
  };
  
  const addDescription = (dayIndex) => {
    const newDays = [...trekData.days];
    newDays[dayIndex].description.push('');
    setTrekData({ ...trekData, days: newDays });
  };
  
  // Handle file change for array fields like 'days'
  const handleDayFileChange = (index, e) => {
    const updatedDays = [...trekData.days];
    updatedDays[index] = { ...updatedDays[index], image: e.target.files[0] };
    setTrekData({ ...trekData, days: updatedDays });
  };
  const handleFileChange = (e) => {
    // Assuming that you are calling this function with the proper 'name' attribute of the input
    const { name, files } = e.target;
  
    if (files.length > 0) {
      // If there's a file selected, update the trekData state with the new file.
      setTrekData(prevState => ({
        ...prevState,
        [name]: files[0] // Store the first selected file.
      }));
    }
  };
  // Function to add a new day
  const addNewDay = () => {
    setTrekData({
      ...trekData,
      days: [...trekData.days, { day: '', cityName: '', description: [], meals: '', imagealt: '' , image:null}],
    });
  };
  const handleChangeArray = (name, index, value) => {
    setTrekData((prev) => {
      const newArray = [...prev[name]];
      newArray[index] = value;
      return { ...prev, [name]: newArray };
    });
  };
  const handleAddArrayItem = (field) => {
    setTrekData((prevTrekData) => ({
      ...prevTrekData,
      [field]: [...prevTrekData[field], ''], // Add a new empty string item
    }));
  };
  const handleRemoveArrayItem = (name, index) => {
    setTrekData((prev) => {
      const newArray = [...prev[name]];
      newArray.splice(index, 1);
      return { ...prev, [name]: newArray };
    });
  };

  const handleBatchChange = (index, e) => {
    const updatedBatch = [...trekData.batch];
    updatedBatch[index] = { ...updatedBatch[index], [e.target.name]: e.target.value };
    setTrekData({ ...trekData, batch: updatedBatch });
  };

  const handleAddBatchItem = () => {
    setTrekData({  ...trekData,
        batch: [
          ...trekData.batch,
          {
       date: '', amount: '' }
    ],
          })

  };
 
  

  // Frontend React Code - handleSubmit function

const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();

    // Append non-array fields to formData
    for (const [key, value] of Object.entries(trekData)) {
        if (!['days', 'included', 'notincluded', 'things','over','related','batch'].includes(key)) {
          formData.append(key, value);
        }
      }
    
    // 'days' is an array of objects, handle accordingly
    trekData.days.forEach((day, index) => {
        for (const [key, value] of Object.entries(day)) {
            if (day.image && day.image instanceof File) {
                formData.append(`dayImage[${index}]`, day.image, day.image.name);
              
          } else if (typeof value === 'string' || typeof value === 'number') {
            // All other values that are strings or numbers can be sent as text fields.
            formData.append(`days[${index}].${key}`, value);
          }
          // Note: If there are other types of fields, you may need to handle them accordingly.
        }
      });
      formData.append('days', JSON.stringify(trekData.days));

    trekData.batch.forEach((batch, index) => {
        formData.append(`batch[${index}].date`, batch.date);
        formData.append(`batch[${index}].amount`, batch.amount);
      });
      formData.append('batch', JSON.stringify(trekData.batch));

      trekData.included.forEach((item, index) => {
        formData.append(`included[${index}]`, item.trim());
      });
  
 // Assuming trekData.notincluded is an array
trekData.notincluded.forEach((item, index) => {
    formData.append(`notincluded[${index}]`, item.trim());
  });
  
  // Assuming trekData.things is an array
  trekData.things.forEach((item, index) => {
    formData.append(`things[${index}]`, item.trim());
  });
  trekData.over.forEach((item, index) => {
    formData.append(`over[${index}]`, item.trim());
  });
  trekData.relatedtreks.forEach((item, index) => {
    formData.append(`relatedtreks[${index}]`, item.trim());
  });
  // 'days' is an array of objects and might include File objects for images

  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value , "hey");
  }
  
    try {
      const response = await fetch('http://localhost:4000/trek/createtrek', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      alert("Data successfully uploaded");
    } catch (error) {
      console.error('Error submitting form:', error);
      alert("Data upload error");
    }
  };
  
  

  return (
    <div className="container mx-auto p-4 ">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-bold">Trek / Tour Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder=' Enter the name of the trek/tour'
            value={trekData.name}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="testimage" className="font-bold">Cover Image:</label>
    <input
      type="file"
      id="testimage"
      name="testimage"
      onChange={handleFileChange} // Ensure you have a handler for file changes
      className="p-2 border border-gray-300 rounded"
    />

  </div>
  <input
        type="text"
        placeholder="Image Alt text"
        name="testimagealt"
        value={trekData.testimagealt}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded"
      />
             <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-bold">Url link</label>
          <input
            type="text"
            id="urllink"
            name="urllink"
            placeholder=' Enter the url of trek/tour'
            value={trekData.urllink}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
      <div className="flex flex-col px-2 w-full">
    <label htmlFor="maintype" className="font-bold">Main Type:</label>
    <input
      type="text"
      id="maintype"
      name="maintype"
      placeholder="Enter: 'grouptour', 'longtour' , 'international', 'northindiatour', 'northindiatrek', 'karnatakatrek', 'keralatrek', 'tntrek' "
      value={trekData.maintype}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>
    
        <div className="flex flex-wrap">
  {/* Amount Input */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="amount" className="font-bold">Amount:</label>
    <input
      type="number"
      id="amount"
      name="amount"
      placeholder="Enter amount"
      value={trekData.amount}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>
  
  {/* Main Type Input */}
  
  {/* State Input */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="state" className="font-bold">State:</label>
    <input
      type="text"
      id="state"
      name="state"
      placeholder="Enter state"
      value={trekData.state}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="state" className="font-bold">State Name</label>
    <input
      type="text"
      id="statename"
      name="statename"
      placeholder="Enter state Name"
      value={trekData.statename}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>
  {/* For Input */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="for" className="font-bold">For:</label>
    <input
      type="text"
      id="for"
      name="for"
      placeholder="Enter: 'for' or 'from'(without transfers)"
      value={trekData.for}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>

  {/* From Amount Input */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="fromamount" className="font-bold">From Amount:</label>
    <input
      type="number"
      id="fromamount"
      name="fromamount"
      placeholder="Enter from amount"
      value={trekData.fromamount}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>

  {/* Reserve Amount Input */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="reserveamount" className="font-bold">Reserve Amount:</label>
    <input
      type="number"
      id="reserveamount"
      name="reserveamount"
      placeholder="Enter the booking amount"
      value={trekData.reserveamount}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>

  {/* Day Input */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="day" className="font-bold">Day:</label>
    <input
      type="text"
      id="day"
      name="day"
      placeholder="Enter the number of days Eg. '2 Days / 1 Night'"
      value={trekData.day}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>

  {/* Trek Type Input */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="trektype" className="font-bold">Trek Type:</label>
    <input
      type="text"
      id="trektype"
      name="trektype"
      placeholder="Enter - 'Trek Type' / 'Tour Type'"
      value={trekData.trektype}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>

  {/* Trek Type Name Input */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="trektypename" className="font-bold">Trek Type Name:</label>
    <input
      type="text"
      id="trektypename"
      name="trektypename"
      placeholder="Enter: Beach Trek, Waterfall trek, Hill Trek"
      value={trekData.trektypename}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>

  {/* Level Input */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="level" className="font-bold">Level:</label>
    <input
      type="text"
      id="level"
      name="level"
      placeholder="Enter 'Activity level'"
      value={trekData.level}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>

  {/* Level Name Input */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="levelname" className="font-bold">Level Name:</label>
    <input
      type="text"
      id="levelname"
      name="levelname"
      placeholder="Enter 'easy', 'moderate', etc. "
      value={trekData.levelname}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>

  {/* Service Input */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="service" className="font-bold">Service:</label>
    <input
      type="text"
      id="service"
      name="service"
      placeholder="Enter 'Stay Type'"
      value={trekData.service}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="service" className="font-bold">Service Name:</label>
    <input
      type="text"
      id="servicename"
      name="servicename"
      placeholder="Enter 'Homestay', '3-Star Hotel, etc."
      value={trekData.servicename}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>
  {/* ... Add input fields for all other properties in a similar fashion ... */}

  {/* Itinerary Input */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="itinerary" className="font-bold">Itinerary:</label>
    <textarea
      id="itinerary"
      name="itinerary"
      placeholder="Enter itinerary paragraph - 'Ask Aaqib - common but change the name"
      value={trekData.itinerary}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>

  {/* Expert Paragraph Input */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="expertpara" className="font-bold">Expert Paragraph:</label>
    <textarea
      id="expertpara"
      name="expertpara"
      placeholder="Enter expert paragraph - Ask Aaqib for this"
      value={trekData.expertpara}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>

  {/* Lead 1 Name Input */}


  {/* ...continue for the rest of the fields... */}

<div className='w-full px-2 py-2'>
  <h3 className="text-center font-semibold">OverView</h3>
  {trekData.over.map((item, index) => (
    <div key={index} className="flex flex-row gap-2 items-center">
      <textarea
        value={item}
        placeholder={`Overview Para  ${index + 1}`}
        onChange={(e) => handleChangeArray('over', index, e.target.value)}
        className="p-2 border border-gray-300 rounded w-full"
      />
      <button
        type="button"
        onClick={() => handleRemoveArrayItem('over', index)}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        Remove
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={() => handleAddArrayItem('over')}
    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
  >
    Add Overview
  </button>
</div>
  {/* Expectation Paragraph */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="expectpara" className="font-bold">What to expect?</label>
    <textarea
      id="expectpara"
      name="expectpara"
      placeholder="Enter what to expect paragraph"
      value={trekData.expectpara}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="expecthead1" className="font-bold">Accommodations Heading:</label>
    <input
      type="text"
      id="expecthead1"
      name="expecthead1"
      placeholder="Enter 'Accommodations' "
      value={trekData.expecthead1}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>

  {/* Accommodations Paragraph */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="expecthead1para" className="font-bold">Accommodations Paragraph:</label>
    <textarea
      id="expecthead1para"
      name="expecthead1para"
      placeholder="Enter'Accommodations' paragraph"
      value={trekData.expecthead1para}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>

  {/* Expedition Team Heading */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="expecthead2" className="font-bold">Backpackers United Team Heading:</label>
    <input
      type="text"
      id="expecthead2"
      name="expecthead2"
      placeholder="Enter 'Backpackers United Team'"
      value={trekData.expecthead2}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>

  {/* Expedition Team Paragraph */}
  <div className="flex flex-col px-2 w-1/2">
    <label htmlFor="expecthead2para" className="font-bold">Backpackers United Team Paragraph:</label>
    <textarea
      id="expecthead2para"
      name="expecthead2para"
      placeholder="Enter Backpackers United team common"
      value={trekData.expecthead2para}
      onChange={handleChange}
      className="p-2 border border-gray-300 rounded"
    />
  </div>
  

</div>
        {/* More input fields for other trekData fields */}

        {/* Dynamic input fields for 'days' */}
        {trekData.days.map((day, index) => (
  <div key={index} className="border p-4 rounded my-4 w-full">
    <div className="flex flex-col gap-4">
      <label className="font-bold text-lg mb-2">Day {index + 1}</label>
      <input
        type="text"
        placeholder="Day Title: 'Day 0', 'Day 1', 'Day 2', and so on"
        name="day"
        value={day.day}
        onChange={(e) => handleDayChange(index, e)}
        className="w-full p-3 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder=" Title: Departure from Bangalore"
        name="cityName"
        value={day.cityName}
        onChange={(e) => handleDayChange(index, e)}
        className="w-full p-3 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Breakfast, Lunch, Dinner, High Tea, whatever"
        name="meals"
        value={day.meals}
        onChange={(e) => handleDayChange(index, e)}
        className="w-full p-3 border border-gray-300 rounded"
      />
      {/* Descriptions */}
      <div className="flex flex-col gap-2">
        {day.description.map((desc, descIndex) => (
          <input
            key={descIndex}
            type="text"
            placeholder={`Bullet Point  ${descIndex + 1}`}
            name={`description[${descIndex}]`}
            value={desc}
            onChange={(e) => handleDescriptionChange(index, descIndex, e)}
            className="w-full p-3 border border-gray-300 rounded"
          />
        ))}
        <button
          type="button"
          onClick={() => addDescription(index)}
          className="px-4 py-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300"
        >
          Add Description
        </button>
      </div>
      {/* Cover Image */}
      <div className="flex items-center gap-2">
        <label className="font-bold text-lg mb-2 flex-shrink-0"> Image:</label>
        <input
          type="file"
          onChange={(e) => handleDayFileChange(index, e)}
          className="w-full p-3 border border-gray-300 rounded"
        />
      </div>
      {/* Image Alt Text */}
      <input
        type="text"
        placeholder="Image Alt Text"
        name="imagealt"
        value={day.imagealt}
        onChange={(e) => handleDayChange(index, e)}
        className="w-full p-3 border border-gray-300 rounded"
      />
    </div>
  </div>
))}
<button
  type="button"
  onClick={addNewDay}
  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 w-full mt-4"
>
  Add New Day
</button>

        <div className="flex flex-wrap -mx-2">
  <div className="w-full md:w-1/2 px-2">
    <h3 className="text-center font-semibold">Included Items</h3>
    {trekData.included.map((include, index) => (
      <div key={index} className="flex flex-row gap-2 items-center">
        <input
          type="text"
          value={include}
          placeholder={`Included ${index + 1}`}
          onChange={(e) => handleChangeArray('included', index, e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <button
          type="button"
          onClick={() => handleRemoveArrayItem('included', index)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Remove
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => handleAddArrayItem('included')}
      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
    >
      Add Included Item
    </button>
  </div>
  <div className="w-full md:w-1/2 px-2">
    <h3 className="text-center font-semibold">Not Included Items</h3>
    {trekData.notincluded.map((notInclude, index) => (
      <div key={index} className="flex flex-row gap-2 items-center">
        <input
          type="text"
          value={notInclude}
          placeholder={`Not Included ${index + 1}`}
          onChange={(e) => handleChangeArray('notincluded', index, e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <button
          type="button"
          onClick={() => handleRemoveArrayItem('notincluded', index)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Remove
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => handleAddArrayItem('notincluded')}
      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
    >
      Add Not Included Item
    </button>
  </div>
</div>
<div>
  <h3 className="text-center font-semibold">Things to Carry</h3>
  {trekData.things.map((item, index) => (
    <div key={index} className="flex flex-row gap-2 items-center">
      <input
        type="text"
        value={item}
        placeholder={`Things to Carry ${index + 1}`}
        onChange={(e) => handleChangeArray('things', index, e.target.value)}
        className="p-2 border border-gray-300 rounded w-full"
      />
      <button
        type="button"
        onClick={() => handleRemoveArrayItem('things', index)}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        Remove
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={() => handleAddArrayItem('things')}
    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
  >
    Add Things to Carry
  </button>
</div>

<div className='w-full px-2 py-2'>
  <h3 className="text-center font-semibold">Add Related Trek/Tour Ids</h3>
  {trekData.relatedtreks.map((item, index) => (
    <div key={index} className="flex flex-row gap-2 items-center">
      <textarea
        value={item}
        placeholder={`Trek ids  ${index + 1}`}
        onChange={(e) => handleChangeArray('relatedtreks', index, e.target.value)}
        className="p-2 border border-gray-300 rounded w-full"
      />
      <button
        type="button"
        onClick={() => handleRemoveArrayItem('relatedtreks', index)}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        Remove
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={() => handleAddArrayItem('relatedtreks')}
    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
  >
    Add Trek/ Tour Id
  </button>
</div>

{/* ... Other parts of the form ... */}
{/* Related section */}

{trekData.batch.map((batchItem, index) => (
  <div key={index} className="border p-4 rounded flex justify-between items-center">
    <div className="flex-1 mr-2">
      <label className="font-bold">Batch {index + 1}</label>
      <input
       type="text"
        name="date"
        value={batchItem.date}
        onChange={(e) => handleBatchChange(index, e)}
        className="p-2 border border-gray-300 rounded w-full"
      />
    </div>
    <div className="w-24 pt-6">
      <input
        type="number"
        placeholder="Amount"
        name="amount"
        value={batchItem.amount}
        onChange={(e) => handleBatchChange(index, e)}
        className="p-2 border border-gray-300 rounded w-full"
      />
    </div>
    <button
      type="button"
      onClick={() => handleRemoveArrayItem('batch', index)}
      className="ml-2 mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
    >
      Remove
    </button>
  </div>
))}

<button
  type="button"
  onClick={handleAddBatchItem}
  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mt-4"
>
  Add Batch
</button>

        {/* Submit button */}
    <div className='flex justify-center'>
        <button
  type="submit"
  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 mt-4"
>
 Create Trek/Tour
</button>
</div>
    </form>
    </div>
  );
};

export default page;
