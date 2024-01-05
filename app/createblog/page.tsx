"use client"
import React,{useState} from 'react'

const page = () => {
    const [blogData, setBlogData] = useState({
        name: '',
        urllink:'',
        over: [],
        blogs: [
            { title: '', para: '',  imagealt: '', image:null }
        ],
        products: []
       
    })
    const handleChange = (e) => {
        setBlogData({ ...blogData, [e.target.name]: e.target.value });
      };
      const handleBlogChange = (index, e) => {
        const updatedBlogs = [...blogData.blogs];
        updatedBlogs[index] = { ...updatedBlogs[index], [e.target.name]: e.target.value };
        setBlogData({ ...blogData, blogs: updatedBlogs });
      };
      const handleBlogFileChange = (index, e) => {
        const updatedBlogs = [...blogData.blogs];
        updatedBlogs[index] = { ...updatedBlogs[index], image: e.target.files[0] };
        setBlogData({ ...blogData, blogs: updatedBlogs });
      };
      const handleChangeArray = (name, index, value) => {
        setBlogData((prev) => {
          const newArray = [...prev[name]];
          newArray[index] = value;
          return { ...prev, [name]: newArray };
        });
      };
      const handleAddArrayItem = (field) => {
        setBlogData((prevDestData) => ({
          ...prevDestData,
          [field]: [...prevDestData[field], ''], // Add a new empty string item
        }));
      };
      const handleRemoveArrayItem = (name, index) => {
        setBlogData((prev) => {
          const newArray = [...prev[name]];
          newArray.splice(index, 1);
          return { ...prev, [name]: newArray };
        });
      };
      const addNewBlog = () => {
        setBlogData({
          ...blogData,
          blogs: [...blogData.blogs, { title: '', para: '',  imagealt: '' , image:null}],
        });
      };
      const removeBlog = (index) => {
        setBlogData((prevBlogData) => {
          const updatedBlogs = prevBlogData.blogs.filter((_, i) => i !== index);
          return { ...prevBlogData, blogs: updatedBlogs };
        });
      };
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const formData = new FormData();
    
        // Append non-array fields to formData
        for (const [key, value] of Object.entries(blogData)) {
            if (!['over','products','blogs'].includes(key)) {
              formData.append(key, value);
            }
          }
          // Assuming trekData.things is an array
          blogData.products.forEach((item, index) => {
            formData.append(`products[${index}]`, item.trim());
          });
          blogData.over.forEach((item, index) => {
            formData.append(`over[${index}]`, item.trim());
          });
          blogData.blogs.forEach((blog, index) => {
            for (const [key, value] of Object.entries(blog)) {
                if (blog.image && blog.image instanceof File) {
                    formData.append(`blogImage[${index}]`, blog.image, blog.image.name);
                  
              } else if (typeof value === 'string' || typeof value === 'number') {
                // All other values that are strings or numbers can be sent as text fields.
                formData.append(`blogs[${index}].${key}`, value);
              }
              // Note: If there are other types of fields, you may need to handle them accordingly.
            }
          });
          formData.append('blogs', JSON.stringify(blogData.blogs));
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value , "hey");
      }
    try {
        const response = await fetch('http://localhost:4000/blog/createblog', {
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
    <div>
       <div className="container mx-auto p-4 ">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-bold">Blog Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder=' Enter the name of the Blog'
            value={blogData.name}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-bold">Blog urllink</label>
          <input
            type="text"
            id="urllink"
            name="urllink"
            placeholder=' Enter the urlink of the Blog'
            value={blogData.urllink}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className='w-full px-2 py-2'>
  <h3 className="text-center font-semibold">OverView</h3>
  {blogData.over.map((item, index) => (
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
{blogData.blogs.map((blog, index) => (
  <div key={index} className="border p-4 rounded my-4 w-full">
    <div className="flex flex-col gap-4">
      <label className="font-bold text-lg mb-2">Sub Blog {index + 1}</label>
      <input
        type="text"
        placeholder="Sub Blog Title: 'Blog 0', 'Blog 1', 'Blog 2', and so on"
        name="title"
        value={blog.title}
        onChange={(e) => handleBlogChange(index, e)}
        className="w-full p-3 border border-gray-300 rounded"
      />
          <div className="flex items-center gap-2">
        <label className="font-bold text-lg mb-2 flex-shrink-0"> Image:</label>
        <input
          type="file"
          onChange={(e) => handleBlogFileChange(index, e)}
          className="w-full p-3 border border-gray-300 rounded"
        />
      </div>
      {/* Image Alt Text */}
      <input
        type="text"
        placeholder="Image Alt Text"
        name="imagealt"
        value={blog.imagealt}
        onChange={(e) => handleBlogChange(index, e)}
        className="w-full p-3 border border-gray-300 rounded"
      />
      <textarea
        placeholder={`Enter Para for blog ${index + 1}`}
        name="para"
        value={blog.para}
        onChange={(e) => handleBlogChange(index, e)}
        className="w-full p-3 border border-gray-300 rounded"
      />
  
    </div>
    <button
      type="button"
      onClick={() => removeBlog(index)}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-300 w-full mt-2"
    >
      Remove Blog {index + 1}
    </button>
  </div>
))}
<button
  type="button"
  onClick={addNewBlog}
  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 w-full mt-4"
>
  Add New Blog
</button>
<div className='w-full px-2 py-2'>
  <h3 className="text-center font-semibold">Products Ids</h3>
  {blogData.products.map((item, index) => (
    <div key={index} className="flex flex-row gap-2 items-center">
      <textarea
        value={item}
        placeholder={`Enter Products ids  ${index + 1}`}
        onChange={(e) => handleChangeArray('products', index, e.target.value)}
        className="p-2 border border-gray-300 rounded w-full"
      />
      <button
        type="button"
        onClick={() => handleRemoveArrayItem('products', index)}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        Remove
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={() => handleAddArrayItem('products')}
    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
  >
    Add Products Ids
  </button>
</div>
<div className='flex justify-center'>
        <button 
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Create Blogs
        </button>
        </div>
        </form>
        </div>
    </div>
  )
}

export default page
