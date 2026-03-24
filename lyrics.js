const text = `It's only love

もしも願い一つだけ
叶うなら
君の側で眠らせて
どんな場所でもいいよ
Beautiful world
迷わず
君だけを見つめている
Beautiful boy
自分の美しさ
まだ知らないの

It's only love

寝ても覚めても少年マンガ
夢見てばっか
自分が好きじゃないの

何が欲しいか分からなくて
ただ欲しがって
ぬるい涙が頬を伝う

言いたいことなんか無い
ただもう一度会いたい
言いたいこと言えない
根性無しかもしれない
それでいいけど

もしも願い一つだけ
叶うなら
君の側で眠らせて
どんな場所でもいいよ
Beautiful world
迷わず
君だけを見つめている
Beautiful boy
自分の美しさ
まだ知らないの

It's only love

どんなことでもやってみて
損をしたって
少し経験値上がる

新聞なんかいらない
肝心なことが載ってない
最近調子どうだい？
元気にしてるなら
別にいいけど

僕の世界消えるまで
会えぬなら
君の側で眠らせて
どんな場所でも結構\\
Beautiful world
儚く
過ぎて行く日々の中で
Beautiful boy
気分のムラは仕方ないね

もしも願い一つだけ
叶うなら
君の側で眠らせて
It's only love`;

async function sendLyrics(sendFn) {
  for (const line of text.split('\n')) {
    sendFn(line);
    await new Promise(r => setTimeout(r, 100));
  }
}

module.exports = { sendLyrics };
