### SETUP ENV
1. Install terlebih dulu node.js di website https://nodejs.org/en/download
2. Pastikan kembali node sudah berhasil di install di setup anda
3. Cek npm --version
4. Jika tidak ada maka lakukan npm install npm
5. Cek kembali npm nya
6. masuk ke directory bgp (pilih salah 1 ya)
7. ketik ini di cmd untuk install dependensi "npm install"
8. lakukan hal yang serupa di bgp 1 nya
9. untuk menjalankan ini terpisah tidak bisa dalam 1 kali perintah karena beda direktori
10. env diganti apabila ingin mengganti domain API

#### FOR BGP_ADMIN
1. cd BGP_Project_Admin
2. npm i
3. setup .env
4. isi VITE_API_BASE_URL={localhost pc klen} kalo gua sih http://localhost:5500
5. npm run dev (buat jalanin admin ajah)

#### FOR BGP_Client
sama ajah kek admin

NOTED : Jalanin nya terpisah ya jadi npm run dev 2 kali nanti port nya bakal beda kok, sama kalo be nya dah deploy http://localhost:5500 diganti sama domain baru
