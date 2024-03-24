import request from 'supertest';
import dotenv from 'dotenv';
import { mongoConnect, mongoDisconnect } from '../utils/mongo';
import app from '../app';
import { mockUserData, mockBlogData } from '../mock/mockData';
import path = require('path');
import Blog from '../models/Blog'
import fs from "fs";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mybranddb';
const newUser = {
    username: "Caleb72",
    password: "My Password"
};

const newComment = {
    sender: "Test Sender",
    comment: "Test Comment"
};

let authToken: string;
let id = "65fd7a01f6f7f2fa932aadb7";

let createdBlogId: string;
let createdCommentId: string;
let commentId: number= 0;

describe("Blog API", () => {
    beforeAll(async () => {
        await mongoConnect(MONGODB_URI);
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe("Test Welcome API", () => {
        test("Should return status 200", async () => {
            await request(app)
                .get("/")
                .expect(200);
        });
    });

    describe("User Sign-Up", () => {
        test("Should sign up a new user", async () => {

        const response = await request(app)
                .post("/api/auth/signup")
                .send(newUser)
                .expect(200);

            expect(response.body.message).toBe("User credentials updated successfully");
        });

        test("Should sign in the user", async () => {
            const signInResponse = await request(app)
                .post("/api/auth/signin")
                .send(newUser)
                .expect(200);

            authToken = signInResponse.body.token;
            expect(authToken).toBeDefined();
        });

     describe("Create new blog", ()=>{
        test("Should create a new blog post", async () => {

            const filePath = path.join(__dirname, "test.jpeg");
            if (!fs.existsSync(filePath)) {
            throw new Error("Test file not found");
            }

            const response1 = await request(app)
                .post("/api/blogs")
                .set("Authorization", `Bearer ${authToken}`)
                .field("bTitle", mockBlogData.bTitle)
                .field("bShortDesc", mockBlogData.bShortDesc)
                .field("bLongDesc", mockBlogData.bLongDesc)
                .attach("bImage", filePath as string)
                .expect(201);

                expect(response1.body).toHaveProperty("bTitle");
                expect(response1.body).toHaveProperty("bShortDesc");
                expect(response1.body).toHaveProperty("bLongDesc");
                expect(response1.body).toHaveProperty("bImage");

                createdBlogId = response1.body._id;
                console.log(createdBlogId);

            const response2 = await request(app)
            .post("/api/blogs")
            .expect(401);
            expect(response2.body.message).toBe("Token is required");
    });
     })

     describe("Get All Blogs",()=>{
        test("Should get all blog posts", async () => {
            const response = await request(app)
                .get("/api/blogs")
                .set("Authorization", `Bearer ${authToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
     })

     describe("Update Blog Post", () => {
        test("Should update an existing blog post", async () => {
            const updatedFilePath = path.join(__dirname, "test.jpeg");
            if (!fs.existsSync(updatedFilePath)) {
            throw new Error("Test file not found");
            }

            const updatedData = {
                bTitle: "Updated Title",
                bShortDesc: "Updated Short Description",
                bLongDesc: "Updated Long Description"
            };

            const response = await request(app)
            .put(`/api/blogs/${createdBlogId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .field("bTitle", updatedData.bTitle)
            .field("bShortDesc", updatedData.bShortDesc)
            .field("bLongDesc", updatedData.bLongDesc)
            .attach("bImage", updatedFilePath as string)
            .expect(200);

            expect(response.body).toHaveProperty("bTitle");
            expect(response.body).toHaveProperty("bShortDesc");
            expect(response.body).toHaveProperty("bLongDesc");
            expect(response.body).toHaveProperty("bImage");
        });

        test("Should return 404 if blog post does not exist", async () => {
            const nonExistentId = "123456789012345678901234";
            const response = await request(app)
                .put(`/api/blogs/${nonExistentId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect(404);
    
            expect(response.body.message).toBe("Blog not found");
        });

    });

    describe("Delete a blog",()=>{
        test("Should delete the last created blog post", async () => {
            expect(createdBlogId).toBeDefined();
            
            const response = await request(app)
                .delete(`/api/blogs/${createdBlogId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect(200);
    
            expect(response.body.message).toBe("Blog deleted successfully");
        });
     })

     describe("Get Blog Post by ID", () => {
        test("Should get an existing blog post by ID", async () => {
            const response = await request(app)
                .get(`/api/blogs/${id}`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect(200);
    
            expect(response.body).toHaveProperty("bTitle");
            expect(response.body).toHaveProperty("bShortDesc");
            expect(response.body).toHaveProperty("bLongDesc");
            expect(response.body).toHaveProperty("bImage");
        });
    
        test("Should return 404 if blog post does not exist", async () => {
            const nonExistentId = "123456789012345678901234";
            const response = await request(app)
                .get(`/api/blogs/${nonExistentId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect(404);
    
            expect(response.body.message).toBe("Blog not found");
        });
    
        test("Should return 400 if ID is invalid", async () => {
            const invalidId = "invalidId";
            const response = await request(app)
                .get(`/api/blogs/${invalidId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect(500);
        });
    });

    
  });
});

describe("Like a blog", () => {
    beforeAll(async () => {
        await mongoConnect(MONGODB_URI);
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    test("should be able to like a blog post", async () => {
        const response = await request(app)
            .post(`/api/blogs/${id}/like`)
            .expect(200);

        expect(response.body.message).toBe("Blog liked successfully");
    });

    test("Like a non-existent blog post", async () => {
        const nonExistentId = "123456789012345678901234";
        const response = await request(app)
            .post(`/api/blogs/${nonExistentId}/like`)
            .expect(404);

        expect(response.body.message).toBe("Blog not found");
    });


})

describe("Blog Comment", () => {
    beforeAll(async () => {
        await mongoConnect(MONGODB_URI);
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    test("Should create a new comment for a blog post", async () => {
        const response = await request(app)
            .post(`/api/blogs/${id}/comments`)
            .send({
                sender: newComment.sender,
                comment: newComment.comment
            })
            .expect(201);

            const blog = response.body.blog;
            const addedComment = blog.bComments[blog.bComments.length - 1];
            expect(addedComment.sender).toBe(newComment.sender);
            expect(addedComment.comment).toBe(newComment.comment);

            createdBlogId = addedComment._id;
            console.log(createdBlogId);
            
     });

     describe("Get Comments for Blog Post", () => {
        test("Should get all comments for a blog post", async () => {
            const response = await request(app)
                .get(`/api/blogs/${id}/comments`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        test("Comment a non-existent blog post", async () => {
            const nonExistentId = "123456789012345678901234";
            const response = await request(app)
                .post(`/api/blogs/${nonExistentId}/comments`)
                .expect(404);
    
            expect(response.body.message).toBe("Blog not found");
        });

        describe("Delete Comment", () => {
            test("Should delete an existing comment", async () => {
                const response = await request(app)
                    .delete(`/api/blogs/${id}/comments/${commentId}`)
                    .set("Authorization", `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body.message).toBe("Comment deleted successfully");
            });
        })
    });


});







