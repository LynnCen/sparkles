const map_data = [
    { code: "[Smile]", title: "smile", re: /\[Smile\]/g, unicode: "😀" },
    { code: "[Drool]", title: "drool", re: /\[Drool\]/g, unicode: "😻" },
    { code: "[CoolGuy]", title: "coolguy", re: /\[CoolGuy\]/g, unicode: "😎" },
    { code: "[Sob]", title: "sob", re: /\[Sob\]/g, unicode: "😭" },
    { code: "[Shy]", title: "shy", re: /\[Shy\]/g, unicode: "😊" },
    { code: "[Silent]", title: "silent", re: /\[Silent\]/g, unicode: "😶" },
    { code: "[Sleep]", title: "sleep", re: /\[Sleep\]/g, unicode: "😴" },
    { code: "[Cry]", title: "cry", re: /\[Cry\]/g, unicode: "😭" },
    { code: "[Awkward]", title: "awkward", re: /\[Awkward\]/g, unicode: "😅" },
    { code: "[Angry]", title: "angry", re: /\[Angry\]/g, unicode: "😡" },
    { code: "[Tongue]", title: "tongue", re: /\[Tongue\]/g, unicode: "😛" },
    { code: "[Grin]", title: "grin", re: /\[Grin\]/g, unicode: "😁" },
    { code: "[Surprise]", title: "surprise", re: /\[Surprise\]/g, unicode: "😯" },
    { code: "[Frown]", title: "frown", re: /\[Frown\]/g, unicode: "🙁" },
    { code: "[Puke]", title: "puke", re: /\[Puke\]/g, unicode: "🤮" },
    { code: "[Chuckle]", title: "chuckle", re: /\[Chuckle\]/g, unicode: "🤡" },
    { code: "[Joyful]", title: "joyful", re: /\[Joyful\]/g, unicode: "😹" },
    { code: "[Smug]", title: "smug", re: /\[Smug\]/g, unicode: "👹" },
    { code: "[Drowsy]", title: "drowsy", re: /\[Drowsy\]/g, unicode: "👺" },
    { code: "[Panic]", title: "panic", re: /\[Panic\]/g, unicode: "😷" },
    { code: "[Sweat]", title: "sweat", re: /\[Sweat\]/g, unicode: "😓" },
    { code: "[Laugh]", title: "laugh", re: /\[Laugh\]/g, unicode: "🤣" },
    { code: "[Scold]", title: "scold", re: /\[Scold\]/g, unicode: "😬" },
    { code: "[Shocked]", title: "shocked", re: /\[Shocked\]/g, unicode: "😲" },
    { code: "[Shhh]", title: "shhh", re: /\[Shhh\]/g, unicode: "🥶" },
    { code: "[Dizzy]", title: "dizzy", re: /\[Dizzy\]/g, unicode: "😵‍💫" },
    { code: "[Toasted]", title: "toasted", re: /\[Toasted\]/g, unicode: "👽" },
    { code: "[Skull]", title: "skull", re: /\[Skull\]/g, unicode: "☠️" },
    { code: "[Hammer]", title: "hammer", re: /\[Hammer\]/g, unicode: "🔨" },
    { code: "[Bye]", title: "bye", re: /\[Bye\]/g, unicode: "🤠" },
    { code: "[Wipe]", title: "wipe", re: /\[Wipe\]/g, unicode: "💪" },
    { code: "[Handclap]", title: "handclap", re: /\[Handclap\]/g, unicode: "🤭" },
    { code: "[Flushed]", title: "flushed", re: /\[Flushed\]/g, unicode: "😳" },
    { code: "[Trick]", title: "trick", re: /\[Trick\]/g, unicode: "👩🏽‍🦲" },
    { code: "[BahL]", title: "bah_", re: /\[BahL\]/g, unicode: "🧑🏻‍🦲" },
    { code: "[Yawn]", title: "yawn", re: /\[Yawn\]/g, unicode: "🥱" },
    { code: "[Shrunken]", title: "shrunken", re: /\[Shrunken\]/g, unicode: "👱" },
    { code: "[Sly]", title: "sly", re: /\[Sly\]/g, unicode: "👱‍" },
    { code: "[Kiss]", title: "kiss", re: /\[Kiss\]/g, unicode: "😘" },
    { code: "[Whimper]", title: "whimper", re: /\[Whimper\]/g, unicode: "😮‍💨" },
    { code: "[Lol]", title: "lol", re: /\[Lol\]/g, unicode: "😂" },
    { code: "[Wrath]", title: "wrath", re: /\[Wrath\]/g, unicode: "🍄" },
    { code: "[LetDown]", title: "letdown", re: /\[LetDown\]/g, unicode: "😔" },
    { code: "[Duh]", title: "duh", re: /\[Duh\]/g, unicode: "😜" },
    { code: "[Helpless]", title: "helpless", re: /\[Helpless\]/g, unicode: "🤕" },
    { code: "[Facepalm]", title: "facepalm", re: /\[Facepalm\]/g, unicode: "🤦‍" },
    { code: "[Smirk]", title: "smirk", re: /\[Smirk\]/g, unicode: "😉" },
    { code: "[Concernet]", title: "concernet", re: /\[Concernet\]/g, unicode: "🥜" },
    { code: "[Yeah]", title: "yeah", re: /\[Yeah\]/g, unicode: "🥔" },
    { code: "[Onlooker]", title: "onlooker", re: /\[Onlooker\]/g, unicode: "🧐" },
    { code: "[GoForlt]", title: "goforlt", re: /\[GoForlt\]/g, unicode: "😤" },
    { code: "[OMG]", title: "omg", re: /\[OMG\]/g, unicode: "😲" },
    { code: "[Doge]", title: "doge", re: /\[Doge\]/g, unicode: "🐶" },
    { code: "[NoProblem]", title: "noprob", re: /\[NoProblem\]/g, unicode: "🙆🏻" },
    { code: "[Wow]", title: "wow", re: /\[Wow\]/g, unicode: "🤗" },
    { code: "[Boring]", title: "boring", re: /\[Boring\]/g, unicode: "🥱" },
    { code: "[Sigh]", title: "sigh", re: /\[Sigh\]/g, unicode: "😮‍💨" },
    {
        code: "[SpurtingBlood]",
        title: "spurtingblood",
        re: /\[SpurtingBlood\]/g,
        unicode: "🤧",
    },
    { code: "[Broken]", title: "broken", re: /\[Broken\]/g, unicode: "😨" },
    { code: "[Lips]", title: "lips", re: /\[Lips\]/g, unicode: "💋" },
    { code: "[Heart]", title: "heart", re: /\[Heart\]/g, unicode: "❤️" },
    { code: "[BrokenHeart]", title: "brokenheart", re: /\[BrokenHeart\]/g, unicode: "💔" },
    { code: "[Hug]", title: "hug", re: /\[Hug\]/g, unicode: "🫂" },
    { code: "[ThumbsUp]", title: "thumbsup", re: /\[ThumbsUp\]/g, unicode: "👍️" },
    { code: "[ThumbsDown]", title: "thumbsdown", re: /\[ThumbsDown\]/g, unicode: "👎️" },
    { code: "[Shake]", title: "shake", re: /\[Shake\]/g, unicode: "🤝" },
    { code: "[Peace]", title: "peace", re: /\[Peace\]/g, unicode: "✌️" },
    { code: "[LoveYou]", title: "loveyou", re: /\[LoveYou\]/g, unicode: "🤟🏼" },
    { code: "[OK]", title: "ok", re: /\[OK\]/g, unicode: "👌🏼" },
    { code: "[Worship]", title: "worship", re: /\[Worship\]/g, unicode: "🙏" },
    { code: "[Cheers]", title: "cheers", re: /\[Cheers\]/g, unicode: "🍻" },
    { code: "[Coffee]", title: "coffee", re: /\[Coffee\]/g, unicode: "☕️" },
    { code: "[Cake]", title: "cake", re: /\[Cake\]/g, unicode: "🍰" },
    { code: "[Rose]", title: "rose", re: /\[Rose\]/g, unicode: "🌹" },
    { code: "[Wilt]", title: "wilt", re: /\[Wilt\]/g, unicode: "🥀" },
    { code: "[Bomb]", title: "bomb", re: /\[Bomb\]/g, unicode: "💣️" },
    { code: "[Poop]", title: "poop", re: /\[Poop\]/g, unicode: "💩" },
    { code: "[Moon]", title: "moon", re: /\[Moon\]/g, unicode: "🌛" },
    { code: "[Sun]", title: "sun", re: /\[Sun\]/g, unicode: "☀️" },
    { code: "[Party]", title: "party", re: /\[Party\]/g, unicode: "🎉" },
    { code: "[GiftF]", title: "gift", re: /\[GiftF\]/g, unicode: "🎁" },
];

export default map_data;
