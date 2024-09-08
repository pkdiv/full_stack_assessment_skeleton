import "reflect-metadata";
import * as express from 'express';
import bodyParser = require("body-parser");
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Home } from "./entity/Home";


const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "db_user",
    password: "6equj5_db_user",
    database: "home_db",
    entities: [User, Home],
    synchronize: false,
    logging: false,
})

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const router = express.Router();
app.use("/", router);

app.listen(3000, () => console.log('App started and is listening on port 3000.'));



AppDataSource.initialize()
    .then(async () => {

        router.get("/", (req: any, res: any) => {
            res.send("The API is up.")
        });

        router.get("/user/find-all", userFindAll);

        router.get("/user/find-by-home", userFindByHome);

        router.get("/home/find-by-user", homeFindByUser);

        router.post("/home/update-users", editHomeUser);

    })
    .catch(
        error => console.log(error)
    );

async function userFindAll(req: express.Request, res: express.Response) {
    const userRepo = AppDataSource.getRepository(User);
    const userData = await userRepo.find();
    res.send(userData);
}

async function userFindByHome(req: express.Request, res: express.Response) {
    const userRepo = AppDataSource.getRepository(User);
    const { street_address } = req.query;

    const homeUsers = await userRepo.createQueryBuilder("user")
        .innerJoinAndSelect("user.home", "home", "home.street_address = :street_address", { street_address })
        .getMany();


    const users = homeUsers.map((record) => {
        return { id: record.id, username: record.username }
    });

    res.send(users);
}

async function homeFindByUser(req: express.Request, res: express.Response) {
    const userRepo = AppDataSource.getRepository(User);
    const { username } = req.query;

    const userHomes = await userRepo.createQueryBuilder("user")
        .leftJoinAndSelect("user.home", "home")
        .where("user.username = :username", { username })
        .getOne();


    res.send(userHomes);
}

async function editHomeUser(req: express.Request, res: express.Response) {
    const userRepo = AppDataSource.getRepository(User);
    const homeRepo = AppDataSource.getRepository(Home);
    const { userIds, homeId } = req.body;


    const homeRecord = await homeRepo.createQueryBuilder("home")
        .leftJoinAndSelect("home.user", "user",)
        .where("home.id = :id", { id: homeId })
        .getMany();

    const users = homeRecord[0].user.map((users) => {
        return users.id;
    });

    let userId = userIds.split(",").map(element => Number(element));


    const addRecords = userId.filter((userId: number) => !users.includes(userId));
    const deletedRecord = users.filter((userId) => userIds.includes(userId));

    const userRecords = []

    for (let index = 0; index < [...addRecords, ...deletedRecord].length; index++) {
        userRecords.push(await userRepo.findOneBy({ id: addRecords[index] }))
    }

    const homeRecordEntry = await homeRepo.findOneBy({ id: homeId });

    homeRecordEntry.user = userRecords;

    await homeRepo.save(homeRecordEntry)

    res.send("Done");

}