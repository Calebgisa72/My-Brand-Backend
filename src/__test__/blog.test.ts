import request from 'supertest';
import dotenv from 'dotenv';
import { mongoConnect, mongoDisconnect } from '../utils/mongo';
import app from '../app';
import { mockUserData, mockBlogData } from '../mock/mockData';
import path = require('path');
import Blog from '../models/Blog'
import Messages from '../models/contact'
import fs from "fs";
import { testMongoConnect, testMongoClose } from '../utils/mongo';

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

const newMessage = {
    sName:"test",
    sEmail:"test@gmail.com",
    sLocation:"test",
    message:"Testing"
}


let authToken: string;
let id = "65fd7a01f6f7f2fa932aadb7";

let createdBlogId: string;
let createdCommentId: string;
let commentId: number= 0;
let fSendedMessageID: string;
let sSendedMessageID: string;

beforeAll(async () => {
    await testMongoConnect(MONGODB_URI);
});

afterAll(async () => {
    await testMongoClose();
});


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

        test("should return status 500 if all reqired credentials are not submitted", async()=>{
            const notUser = {
                    username: "Cadas72",
            };
            const response = await request(app)
                .post("/api/auth/signup")
                .send(notUser)
                .expect(500)
        })

        test("Should sign in the user", async () => {
            const signInResponse = await request(app)
                .post("/api/auth/signin")
                .send(newUser)
                .expect(200);

            authToken = signInResponse.body.token;
            expect(authToken).toBeDefined();

        });

        test("should return status 500 if all reqired credentials are not submitted", async()=>{
            const notUser = {
                username: "Caleb72"
              };
            const response = await request(app)
                .post("/api/auth/signin")
                .send(notUser)
                .expect(500);
        })

        test("Should not sign in a fake user", async ()=>{
            const fakeUser = {
                username: "72",
                password: "My Passd"
            };
            const signInResponse = await request(app)
                .post("/api/auth/signin")
                .send(fakeUser)
                .expect(401);
                expect(signInResponse.body.message).toBe("Invalid username or password");
        })

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

                expect(response1.body.newBlog).toHaveProperty("bTitle");
                expect(response1.body.newBlog).toHaveProperty("bShortDesc");
                expect(response1.body.newBlog).toHaveProperty("bLongDesc");
                expect(response1.body.newBlog).toHaveProperty("bImage");

                createdBlogId = response1.body.newBlog._id;

            const response2 = await request(app)
            .post("/api/blogs")
            .expect(401);
            expect(response2.body.message).toBe("Token is required");

            const response3 = await request(app)
            .post("/api/blogs")
            .set("Authorization", `Bearer ${authToken}kjjhewdckjcw`)
            .expect(401)
            expect(response3.body.message).toBe("Invalid token")
    });

    test("Should return 400 if image file is not provided", async () => {
        const invalidBlogData = {
            bTitle: "Test Blog",
            bShortDesc: "Test Short Description",
            bLongDesc: "Test Long Description"
        };

        const response = await request(app)
            .post("/api/blogs")
            .set("Authorization", `Bearer ${authToken}`)
            .send(invalidBlogData)
            .expect(400);
        expect(response.body.message).toBe("Image file is required");
    });

    test("Should return 500 if an internal server error occurs", async () => {
        const invalidBlogData = {};
        const filePath = path.join(__dirname, "test.jpeg");
            if (!fs.existsSync(filePath)) {
            throw new Error("Test file not found");
            }
        const response = await request(app)
            .post("/api/blogs")
            .set("Authorization", `Bearer ${authToken}`)
            .attach("bImage", filePath as string)
            .field(invalidBlogData)
            .expect(500);
            
        expect(response.body.message).toBe("Internal server error");
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

        test("Should return 500 if an internal server error occurs", async () => {
            jest.spyOn(Blog, "find").mockRejectedValueOnce(new Error("Database error"));
            const response = await request(app)
                .get("/api/blogs")
                .set("Authorization", `Bearer ${authToken}`)
                .expect(500);
        });
     })

     describe("Update Blog Post", () => {
        test("Should update an existing blog post", async () => {
            const updatedFilePath = path.join(__dirname, "test.jpeg");
            if (!fs.existsSync(updatedFilePath)) {
            throw new Error("Test file not found");
            }

            const updatedData = {
                bTitle: "Title Update",
                bShortDesc: "Short Description Updated",
                bLongDesc: "Long Description Updated"
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

        test("Should return 404 if blog post does not exist", async () => {
            const nonExistentId = "123456789012345678901234";
            const response = await request(app)
                .delete(`/api/blogs/${nonExistentId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect(404);
    
            expect(response.body.message).toBe("Blog not found");
        });

        test("should return status 500 if all reqired credentials are not submitted", async ()=>{
            let id= "664343982763"
            const response = await request(app)
            .delete(`/api/blogs/${id}`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(500);

        })
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

    test("Should return status 500 when trying to like a  blog id which is invalid", async () => {
        let fakeId = "26712"
        const response = await request(app)
            .post(`/api/blogs/${fakeId}/like`)
            .expect(500);
        });

        test("should be able to dislike a blog post", async () => {
            const response = await request(app)
                .post(`/api/blogs/${id}/disLike`)
                .expect(200);
    
            expect(response.body.message).toBe("Blog disliked successfully");
        });
    
        test("disLiking a non-existent blog post", async () => {
            const nonExistentId = "123456789012345678901234";
            const response = await request(app)
                .post(`/api/blogs/${nonExistentId}/disLike`)
                .expect(404);
    
            expect(response.body.message).toBe("Blog not found");
        });
    
        test("Should return status 500 when trying to dislike a  blog id which is invalid", async () => {
            let fakeId = "26712"
            const response = await request(app)
                .post(`/api/blogs/${fakeId}/disLike`)
                .expect(500);
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
            
     });

     test("Should return status 404 when the blog is not there", async () => {
        let fakeId = "65fd7a01f6f7f2fa932aad99"
        const response = await request(app)
            .post(`/api/blogs/${fakeId}/comments`)
            .send({
                sender: newComment.sender,
                comment: newComment.comment
            })
            .expect(404);
        });

     describe("Get Comments for Blog Post", () => {
        test("Should get all comments for a blog post", async () => {
            const response = await request(app)
                .get(`/api/blogs/${id}/comments`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        test("Should return status 500 when the blog id is invalid", async () => {
            let fakeId = "26712"
            const response = await request(app)
                .post(`/api/blogs/${fakeId}/comments`)
                .send({
                    sender: newComment.sender,
                    comment: newComment.comment
                })
                .expect(500);
            });

        test("Get Comment of non-existent blog post", async () => {
            const nonExistentId = "123456789012345678901234";
            const response = await request(app)
            .get(`/api/blogs/${nonExistentId}/comments`)
            .expect(404);
    
            expect(response.body.message).toBe("Blog not found");
        });

        test("Should return status 500 when trying to get comments of a  blog id which is invalid", async () => {
            let fakeId = "26712"
            const response = await request(app)
                .get(`/api/blogs/${fakeId}/comments`)
                .expect(500);
            });

        describe("Delete Comment", () => {
            test("Should delete an existing comment", async () => {
                const response = await request(app)
                    .delete(`/api/blogs/${id}/comments/${commentId}`)
                    .set("Authorization", `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body.message).toBe("Comment deleted successfully");
            });

            test("Trying to delete a comment on a non-existing blog", async () => {
                const nonExistentId = "123456789012345678901234";
                const response = await request(app)
                .delete(`/api/blogs/${nonExistentId}/comments/${commentId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect(404);
        
                expect(response.body.message).toBe("Blog not found");
            });

            test("deleting a non-exisitng comment", async()=>{
                const  response = await request(app)
                .delete(`/api/blogs/${id}/comments/NAN`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect(400)
                expect(response.body.message).toBe("Invalid comment index");
            })

            test("Should return status 500 when trying to delete comment of a blog id which is invalid", async () => {
                let fakeId = "26712"
                const response = await request(app)
                .delete(`/api/blogs/${fakeId}/comments/${commentId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect(500)
                });
        })
    });

    let messageDetails = {
        sName: 'Sender Name',
        sEmail: 'test@gmail.com',
        message: 'Test message'
    }
    
    describe("Message Functionality", ()=>{
    
        test('Should send a message without sLocation', async () => {
            const response = await request(app)
                .post('/api/message')
                .send(messageDetails)
                .expect(201);
        
            expect(response.body.message).toBe('Message sent successfully');
        
            fSendedMessageID = response.body.data._id;
        });

        test("Should send a message with sLocation", async () => {
            let messageDetailss = {
                sName: 'Sender Name',
                sEmail: 'test@gmail.com',
                sLocation: 'Test Location',
                message: 'Test message'
            }
            const response = await request(app)
                .post('/api/message')
                .send(messageDetailss)
                .expect(201);
        
            expect(response.body.message).toBe('Message sent successfully');
            sSendedMessageID = response.body.data._id;
        });
        
        test('Should return 400 for invalid email format', async () => {
            let fakeEmail = {
                    sName: 'jhasxa',
                    sEmail: 'invalid email',
                    message: 'Test message'
            }
            await request(app)
                .post('/api/message')
                .send(fakeEmail)
                .expect(400, { error: 'Enter a valid email' });
        });

        test('Should return 500 for missing some required properties', async () => {
            let missingMessage = {
                sName:"test",
                sEmail:"test@gmail.com"
            }
            await request(app)
                .post('/api/message')
                .send(missingMessage)
                .expect(500);
        });
    })
    
    describe('GET /api/messages', () => {
        test('should return all messages', async () => {
            const response = await request(app)
            .get("/api/message")
            .set("Authorization", `Bearer ${authToken}`)
            .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return status 500 if an error occurs', async () => {
            jest.spyOn(Messages, "find").mockRejectedValueOnce(new Error("Database error"));
            const response = await request(app)
                .get("/api/message")
                .set("Authorization", `Bearer ${authToken}`)
                .expect(500);
        });

    });

    describe("Delete a Message",()=>{
        test("Should delete the Messages i created in the test", async () => {
            
            const response = await request(app)
                .delete(`/api/message/${fSendedMessageID}`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect(200);
    
            expect(response.body.message).toBe("Message deleted successfully");

            const response2 = await request(app)
                .delete(`/api/message/${sSendedMessageID}`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect(200);
                expect(response2.body.message).toBe("Message deleted successfully");
        });

        test("Should return 404 if message does not exist", async () => {
            const nonExistentId = "123456789012345678901234";
            const response = await request(app)
                .delete(`/api/message/${nonExistentId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .expect(404);
    
            expect(response.body.message).toBe("Message not found");
        });

        test("should return status 500 if id is invalid", async ()=>{
            let fakeId= "664343982763"
            const response = await request(app)
            .delete(`/api/message/${fakeId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(500);

        })
     })

});









