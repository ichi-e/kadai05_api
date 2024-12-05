import { app, db, dbRef } from "./firebaseConfig.js";
import { getDatabase, ref, push, set, onChildAdded, update, remove, onChildChanged, onChildRemoved }
    from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const auth = getAuth();
const user = auth.currentUser;

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user);
        setUI(user);
        newPost(user);
        displayWishes(user);
    } else {
        guestUI();
        displayWishes();
    }
});

// ログイン中の表示
function setUI(user) {
    let sign = `
        <p class="logout"><img src="img/logout.png" alt="Logout"><span>Logout</span></p>
    `;
    $("#user_sign").append(sign);

    $("#user_sign").on("click", ".logout", function () {
        signOut(auth).then(() => {
            console.log("User signed out successfully.");
            window.location.href = "login.html";
        }).catch((error) => {
            console.error("Error signing out: ", error);
        });
    });
}

// データベースへの書き込み
function newPost(user) {
    $("#send").on("click", function () {
        let date = new Date();

        const msg = {
            uname : $("#uname").val(),
            text: $("#text").val(),
            time: date.toLocaleString(),
            prefecture: $("#prefecture").val(),
            city: $("#city").val(),
            uid: user.uid
        }
        const newPostRef = push(dbRef); // ユニークキー
        set(newPostRef, msg) //書き込み

        $("#uname").val("");
        $("#text").val("");
        $("#city").val("");
        $("#prefecture").prop("selectedIndex", -1);
        $("#popup").prop('checked', false);
    })
}

// データベースから取得して表示
function displayWishes(user = null) {
    onChildAdded(dbRef, function (data) {
        const msg = data.val();
        const key = data.key;
        const replaceText = msg.text.replace(/\n/g, '<br>');

        if ($("#" + key).length > 0) {
            return;
        }
        
        const isOwner = user && user.uid === msg.uid;

        let h = `
        <div id="${key}" class="msg_wrap ${msg.change ? "change" : ""}">
            <p class="title">${msg.uname}</p>
            <div contentEditable="true" id="${key}_update" class="msg_area">
                <p>${replaceText}</p>
            </div>
            <div class="msg_info">
                <p class="time">${msg.time}</p>
                <div class="controll">
                    ${isOwner ? `<p class="update" data-key="${key}"><img src="img/icon.png" alt="更新"></p>` : ""}
                    ${isOwner ? `<p class="remove" data-key="${key}">×</p>` : ""}
                </div>
            </div>
        </div>
        `
        console.log(msg);
        $("#output").append(h);

    });
}

// ゲストの表示
function guestUI() {
    let sign = `
        <p class="login"><a href="login.html"><img src="img/login.png" alt="Login"><span>Login</span></a></p>
    `
    $("#user_sign").append(sign);

    $("#txt_label").addClass("hide");
}

// 削除
$("#output").on("click", ".remove", function(){
    const key = $(this).attr("data-key");
    const remove_item = ref(db, "chat/"+key);
    remove(remove_item);
});

// 更新
$("#output").on("click", ".update", function () {
    let date = new Date();
    const key = $(this).attr("data-key");
    const updatedText = $("#" + key + "_update")
    .html()
    .replace(/<div>/g, "\n")
    .replace(/<\/div>/g, "")
    .replace(/<br>/g, "\n");
    
    $("#" + key).addClass("change")  
    
    update(ref(db, "chat/"+key),{
        text: updatedText.trim(),
        time: date.toLocaleString(),
        change: true
    });
    console.log(key)

});

onChildRemoved(dbRef, (data) => {
    $("#"+data.key).remove();
});

onChildChanged(dbRef, (data) => {
    let date = new Date();
    const replaceText = data.val().text.replace(/\n/g, '<br>');

    $("#" + data.key + '_update').html(replaceText);
    $("#" + data.key + " .time").html(date.toLocaleString());
    $("#" + data.key + '_update').fadeOut(800).fadeIn(800);
});

// セレクトボックス作成
const prefectures = [
    { code: 1, name: "北海道" },
    { code: 2, name: "青森県" },
    { code: 3, name: "岩手県" },
    { code: 4, name: "宮城県" },
    { code: 5, name: "秋田県" },
    { code: 6, name: "山形県" },
    { code: 7, name: "福島県" },
    { code: 8, name: "茨城県" },
    { code: 9, name: "栃木県" },
    { code: 10, name: "群馬県" },
    { code: 11, name: "埼玉県" },
    { code: 12, name: "千葉県" },
    { code: 13, name: "東京都" },
    { code: 14, name: "神奈川県" },
    { code: 15, name: "新潟県" },
    { code: 16, name: "富山県" },
    { code: 17, name: "石川県" },
    { code: 18, name: "福井県" },
    { code: 19, name: "山梨県" },
    { code: 20, name: "長野県" },
    { code: 21, name: "岐阜県" },
    { code: 22, name: "静岡県" },
    { code: 23, name: "愛知県" },
    { code: 24, name: "三重県" },
    { code: 25, name: "滋賀県" },
    { code: 26, name: "京都府" },
    { code: 27, name: "大阪府" },
    { code: 28, name: "兵庫県" },
    { code: 29, name: "奈良県" },
    { code: 30, name: "和歌山県" },
    { code: 31, name: "鳥取県" },
    { code: 32, name: "島根県" },
    { code: 33, name: "岡山県" },
    { code: 34, name: "広島県" },
    { code: 35, name: "山口県" },
    { code: 36, name: "徳島県" },
    { code: 37, name: "香川県" },
    { code: 38, name: "愛媛県" },
    { code: 39, name: "高知県" },
    { code: 40, name: "福岡県" },
    { code: 41, name: "佐賀県" },
    { code: 42, name: "長崎県" },
    { code: 43, name: "熊本県" },
    { code: 44, name: "大分県" },
    { code: 45, name: "宮崎県" },
    { code: 46, name: "鹿児島県" },
    { code: 47, name: "沖縄県" }
];

const selectBox = $("#prefecture");
prefectures.forEach(pref => {
    const option = `
    <option value="${pref.name}">${pref.name}</option>
    `
    selectBox.append(option);
});