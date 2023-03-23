const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai")

app.use(express.json());
app.use(cors());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY

});
const openai = new OpenAIApi(configuration);

app.get("/",(req,res)=>{
    res.send("hello shuvo")
})
app.post("/chat", async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.2,
            max_tokens: 300,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        })
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({error})
    }
})

app.listen(8000,()=>{
    console.log(`server is running on port ${8000}`)
})
