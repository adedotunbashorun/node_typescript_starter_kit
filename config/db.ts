export const MONGODB_URI = "mongodb://heroku_v1prd4qw:3rb6i64fhi9iu8nt1ornojptjf@ds231133.mlab.com:31133/heroku_v1prd4qw";

if (!MONGODB_URI) {
    console.log("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}