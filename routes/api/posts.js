const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Post = require("../.././models/Post");
const Profile = require("../.././models/Profile");

const validatePostLogin = require("../../validation/post");

//@route  GET api/posts/test
//@desc   test posts route
//@access public route
router.get("/test", (req, res) => {
  res.json({
    msg: "Posts work"
  });
});

//@route  POST api/posts
//@desc   create post
//@access private route
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostLogin(req.body);

    //check validation
    if (!isValid) {
      res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user
    });

    newPost.save().then(post => res.json(post));
  }
);

//@route  GET api/posts
//@desc   get all posts
//@access public route
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .populate("user", ["name", "avatar"])
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      res.status(404).json({ post: "there are no posts" });
    });
});

//@route  GET api/posts/:id
//@desc   get post by id
//@access public route
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .populate("user", ["name", "avatar"])
    .then(post => {
      res.json(post);
    })
    .catch(err => {
      res.status(404).json({ post: "there is no post" });
    });
});

//@route  DELETE api/posts/:id
//@desc   delete post
//@access private route
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() != req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "user not authorized" });
          }

          //delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "no post found" }));
    });
  }
);

//@route  POST api/posts/like/:id
//@desc   like post
//@access private route
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: "user already liked this post" });
        }

        //add user id to likes array
        post.likes.unshift({ user: req.user.id });

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "no post found" }));
  }
);

//@route  POST api/posts/unlike/:id
//@desc   unlike post
//@access private route
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "you have not yet liked this post" });
          }

          //get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          //splice out of array
          post.likes.splice(removeIndex, 1);

          //save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "no post found" }));
    });
  }
);

//@route  POST api/posts/comment/:id
//@desc   add comment to post
//@access private route
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostLogin(req.body);

    //check validation
    if (!isValid) {
      res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        //add to comments array
        post.comments.unshift(newComment);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "post not found" }));
  }
);

//@route  DELETE api/posts/comment/:id/:comment_id
//@desc   delete comment from post
//@access private route
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //check if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "comment does not exist" });
        }

        //get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        //splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "post not found" }));
  }
);

module.exports = router;
