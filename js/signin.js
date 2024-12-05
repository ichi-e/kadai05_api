import { app, db, dbRef } from "./firebaseConfig.js";

//新規登録処理
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
const auth = getAuth();

$("#register").on('click', function(e) {
  let email = $("#email").val();
  let password = $("#password").val();
  
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        console.log('登録成功:', userCredential.user);
        
        sendEmailVerification(auth.currentUser)
        .then(() => {
            alert("確認メールを送信しました。メールを確認してください。")
        })
        .catch((error) => {
            console.error("送信失敗:", error);
        });

    })
    .catch((error) => {
        alert('登録できません（' + error.message + '）');
    });
});

$("#login").on('click', function(e) {
  let email = $("#email").val();
  let password = $("#password").val();
  
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        console.log('ログイン成功:', userCredential.user);
        window.location.href = "index.html";
    })
    .catch((error) => {
        alert('ログインできません（' + error.message + '）');
    });
});


