import { server } from "../../src/mocks/server";
import { expect } from "chai";
import { HttpNodeEngine, HttpClient, HttpError } from "../../src";
// TODO: add isRight function to the client
import { isRight, isLeft } from "fp-ts/Either";

describe("Http client node", function () {
	before(() => server.listen());
	afterEach(() => server.resetHandlers());
	after(() => server.close());

	it("should work", async function () {
		const client = new HttpClient(
			"https://localhost:3000",
			new HttpNodeEngine()
		);
		const res = await client.url("/test").get();
		expect(isRight(res)).to.be.true;
	});

	it("should return a data on get request", async function () {
		const client = new HttpClient(
			"https://localhost:3000",
			new HttpNodeEngine()
		);
		const res = await client
			.url("/test")
			.get<Record<string, string>, any>();
		if (isRight(res)) {
			expect(res.right.data).to.deep.equal({ hello: "hello" });
		} else {
			throw new Error("incorrect");
		}
	});

	it("should return a response on get request", async function () {
		const client = new HttpClient(
			"https://localhost:3000",
			new HttpNodeEngine()
		);
		const res = await client
			.url("/test")
			.get<Record<string, string>, any>();
		if (isRight(res)) {
			expect(res.right.response).to.deep.equal({
				status: 200,
				statusText: "OK",
				url: "",
				headers: {
					"content-type": "application/json",
					"x-powered-by": "msw",
				},
			});
		} else {
			throw new Error("incorrect");
		}
	});

	it("should fail on 404", async function () {
		const client = new HttpClient(
			"https://localhost:3000",
			new HttpNodeEngine()
		);
		const res = await client.url("/not-found").get();
		if (isLeft(res)) {
			expect((res.left as HttpError).status).to.equal(404);
		} else {
			throw new Error("incorrect");
		}
	});
});