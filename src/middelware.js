let { connect } = require('lotion')
let GCI = 'ee8716c1be0fbb78b65081c692c4558dcdd23d16b2f121174c2784ecead6762a';

async function main() {
  let { state, send } = await connect(GCI);
  console.log(await state); // { count: 0 }
  console.log(await send({ nonce: 0 })); // { ok: true }
  console.log(await state); // { count: 1 }
}

main();
