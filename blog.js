const express=require('express')
const app=express();
app.use(express.json());

let post=[];
let comments=[];
let postId=1;
let commentid=1;
app.use(express.json());

app.get('/posts',(req,res)=>
{
    res.json(post);
});

app.post('/posts',(req,res)=>
{
const {title,content}=req.body;
const newPost = {
    id: postId++,
    title,
    content,
    createdAt: new Date(),
  };
post.push(newPost);
res.status(201).json({message:"blog created successfully"})
});


app.put('/posts/:id',(req,res)=>
{
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  const post = post.find((p) => p.id === id);
  if(!post){
    res.status(404).json({message:"post not found"}); 
  }
  if (title) post.title = title;
  if (content) post.content = content;
  res.json(post);
});



app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const postIndex = posts.findIndex((p) => p.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found" });
  }
  post.splice(postIndex, 1);

  comments = comments.filter((c) => c.postId !== id);

  res.json({ message: "Post and related comments deleted" });
});

app.post("/posts/:id/comments", (req, res) => {
  const id = parseInt(req.params.id);
  const { author, text } = req.body;

  const post = post.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const newComment = {
    id: commentid++,
    postId: id,
    author,
    text,
    createdAt: new Date(),
  };
  comments.push(newComment);
  res.status(201).json(newComment);
});

app.get("/posts/:id/comments", (req, res) => {
  const id = parseInt(req.params.id);
  const postComments = comments.filter((c) => c.postId === id);
  res.json(postComments);
});

app.delete("/comments/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const commentIndex = comments.findIndex((c) => c.id === id);
  if (commentIndex === -1) {
    return res.status(404).json({ message: "Comment not found" });
  }

  comments.splice(commentIndex, 1);
  res.json({ message: "Comment deleted" });
});



app.listen(3000,()=>{
    console.log("server running on port 300");
})