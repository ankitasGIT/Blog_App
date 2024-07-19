import React, {useState, useEffect} from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard.js';

axios.defaults.headers.common['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjkwZmQzYjUyY2UzNDVmNjFkODBjNTgiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3MjA5NTA0ODksImV4cCI6MTcyMTAzNjg4OX0.qppfb3BH2iynBcTA0z10tfcuzhfQlcwWnA1iBeGPRCc`;

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  //get blogs
  const getAllBlogs = async() => {
    try {
      const token = localStorage.getItem('token');
      const {data} = await axios.get('http://localhost:8080/api/v1/blogs/all-blog');

      if(data?.success)
      {
        setBlogs(data?.blogs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  return (
    <div>
      {blogs && blogs.map((blog) => <BlogCard
       title = {blog.title}
       description = {blog.description}
       image = {blog.image}
       username = {blog.user.username}
       time = {blog.createdAt}
      />)}
    </div>
  );
  
};

export default Blogs;
