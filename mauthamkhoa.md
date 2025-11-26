ĐẠI HỌC QUỐC GIA THÀNH PHỐ HỒ CHÍ MINH
TRƯỜNG ĐẠI HỌC BÁCH KHOA
KHOA KHOA HỌC ỨNG DỤNG
BÁO CÁO NGÀY HỘI KỸ THUẬT
Đề tài: Cánh tay robot trong công nghiệp
GVHD: ThS. Nguyễn Thái Hiền
Lớp : L02
Nhóm: Ngũ Lực Bách Khoa
TP.HCM, 12/2024
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
Danh sách thành viên:
STT Thành viên nhóm MSSV Công việc
1 Lê Thị Nhã My 2412138 Latex, thuyết trình, tìm hiểu code
2 Lê Trung Nghĩa 2412263 Nội dung báo cáo
3 Dương Anh Khôi 2411678 Làm sản phẩm, tìm hiểu code, thiết kế mạch
4 Lâm Thanh Bình 2410343 Làm sản phẩm, tìm hiểu code
5 Nguyẽn Võ Sơn Tùng 2413879 Tìm hiểu code, Làm sản phẩm
6 Đặng Huỳnh Anh Bảo 2410220 Tìm hiểu code, Powerpoint
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
Mục lục
NHẬN XÉT CỦA GIÁO VIÊN . . . . . . . . . . . . . . . . . . . . . . . . . . . 1
DANH SÁCH HÌNH VẼ . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 2
LỜI NÓI ĐẦU . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
LỜI CẢM ƠN . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
CHƯƠNG 1: MỞ ĐẦU . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
1.1 Lí do chọn đề tài . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
1.2 Mục tiêu . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
CHƯƠNG 2: NỘI DUNG . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
2.1 Cánh tay robot công nghiệp là gì? . . . . . . . . . . . . . . . . . . . . . . . . 6
2.2 Cấu tạo . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
2.3 Nguyên lý hoạt động . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
2.4 Vai trò và ứng dụng . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
2.5 Những thách thức và tương lai của cánh tay robot công nghiệp . . . . . . . 9
CHƯƠNG 3: TRÌNH BÀY SẢN PHẨM . . . . . . . . . . . . . . . . . . . . . 12
3.1 Nguyên liệu và dụng cụ chế tạo . . . . . . . . . . . . . . . . . . . . . . . . . 12
3.2 Các bước thực hiện . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17
BẢNG THIẾT KẾ MẠCH ĐIỆN VÀ SẢN PHẨM . . . . . . . . . . . . . . 26
TÀI LIỆU THAM KHẢO . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 27
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
NHẬN XÉT CỦA GIÁO VIÊN
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————
——————————————————————————————————————–
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 1/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
DANH SÁCH HÌNH VẼ
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 2/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
LỜI GIỚI THIỆU
Trong thời đại mà công nghệ và tự động hóa không ngừng phát triển, cánh tay robot
công nghiệp đã trở thành biểu tượng của sự tiến bộ vượt bậc trong lĩnh vực sản xuất.
Đây là thiết bị cơ khí thông minh, tích hợp trí tuệ nhân tạo, điều khiển tự động và kỹ
thuật chính xác, giúp tối ưu hóa các quy trình sản xuất và nâng cao hiệu quả lao động.
Với khả năng hoạt động linh hoạt, chính xác và bền bỉ, cánh tay robot công nghiệp
không chỉ giải phóng sức lao động con người mà còn mở ra những tiềm năng mới cho
nền công nghiệp hiện đại.
Nhận thức được tầm quan trọng và sức ảnh hưởng của công nghệ này, nhóm Ngũ
Lực Bách Khoa đã lựa chọn đề tài “Cánh tay robot công nghiệp” nhằm nghiên cứu sâu
hơn về nguyên lý hoạt động, cấu tạo kỹ thuật, cũng như vai trò to lớn của thiết bị này
trong các dây chuyền sản xuất. Cánh tay robot công nghiệp không chỉ là một công cụ hỗ
trợ, mà còn là giải pháp đột phá, góp phần thúc đẩy sự chuyển đổi số trong ngành công
nghiệp 4.0.
Bài tiểu luận không chỉ tập trung phân tích các khía cạnh kỹ thuật và ứng dụng
thực tiễn mà còn đặt vấn đề về những thách thức và định hướng phát triển trong tương
lai của cánh tay robot. Qua đó, chúng em mong muốn góp phần xây dựng cái nhìn toàn
diện về công nghệ này, đồng thời truyền cảm hứng cho những nghiên cứu và sáng tạo
mới trong lĩnh vực tự động hóa.
Chúng em hy vọng rằng nội dung bài tiểu luận sẽ mang lại những giá trị hữu ích và
được đón nhận nồng nhiệt từ quý thầy cô và các bạn yêu thích công nghệ.
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 3/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
LỜI CẢM ƠN
Là một tập thể sinh viên thuộc Trường Đại học Bách Khoa TP.HCM, mang trong
mình niềm đam mê và khát vọng khám phá lĩnh vực tự động hóa, chúng em vô cùng
biết ơn khi được Thầy Nguyễn Thái Hiền trao cơ hội thực hiện bài tiểu luận với chủ đề
"Cánh tay robot công nghiệp." Đây không chỉ là cơ hội để chúng em tiếp cận và hiểu
rõ hơn về một trong những công nghệ tiên tiến của thời đại mà còn giúp chúng em rèn
luyện kỹ năng làm việc nhóm, tư duy logic và khả năng nghiên cứu khoa học.
Trong quá trình thực hiện, chúng em không tránh khỏi những thiếu sót, do đây là
lần đầu tiên chúng em tiếp cận chuyên sâu về lĩnh vực này cũng như làm việc trong
môi trường học tập đòi hỏi tính chuyên môn cao. Vì vậy, chúng em rất mong nhận được
những lời góp ý chân thành từ Thầy để bài tiểu luận được hoàn thiện hơn, đồng thời
giúp chúng em rút ra những bài học giá trị cho hành trình học tập và nghiên cứu sau
này.
Chúng em xin chân thành cảm ơn sự hướng dẫn tận tình và những hỗ trợ quý
báu từ Thầy. Những chia sẻ và góp ý của Thầy sẽ là hành trang quý giá giúp chúng
em ngày càng trưởng thành hơn trên con đường chinh phục tri thức và phát triển bản thân.
Nhóm sinh viên thực hiện
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 4/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
CHƯƠNG 1: MỞ ĐẦU
1.1 Lí do chọn đề tài
Chủ đề "Cánh tay robot công nghiệp" được chọn bởi đây là một lĩnh vực quan trọng
trong quá trình tự động hóa và phát triển công nghệ hiện đại. Cánh tay robot không chỉ
mô phỏng chuyển động linh hoạt của con người mà còn mang lại hiệu quả vượt trội trong
sản xuất nhờ khả năng làm việc chính xác, liên tục và an toàn.
Ngoài ra, với sự đa dạng về kích thước và ứng dụng, chúng đáp ứng được nhiều nhu
cầu khác nhau trong công nghiệp, từ các thao tác tinh vi đến xử lý những vật nặng. Việc
tìm hiểu và nghiên cứu về cánh tay robot không chỉ giúp hiểu rõ hơn về công nghệ tiên
tiến mà còn khám phá những lợi ích mà chúng mang lại trong việc nâng cao năng suất,
giảm chi phí lao động và thúc đẩy sự phát triển bền vững trong sản xuất.
Chủ đề này cũng phản ánh xu hướng công nghiệp 4.0, nơi robot hóa đóng vai trò chủ
đạo trong việc cải thiện hiệu quả và đổi mới các quy trình làm việc, từ đó mở ra nhiều
cơ hội cho nghiên cứu và ứng dụng thực tiễn.
1.2 Mục tiêu
Mục tiêu của bài luận này là cung cấp một cái nhìn tổng quan và sâu sắc về cánh
tay robot công nghiệp, từ cấu trúc, nguyên lý hoạt động đến các ứng dụng thực tế trong
sản xuất. Bài luận nhằm phân tích những lợi ích nổi bật của cánh tay robot trong việc
nâng cao năng suất, đảm bảo độ chính xác và giảm chi phí lao động.
Đồng thời, bài viết cũng hướng đến việc làm rõ vai trò của cánh tay robot trong
sự phát triển của công nghệ tự động hóa, đặc biệt trong bối cảnh cuộc cách mạng công
nghiệp 4.0. Qua đó, bài luận không chỉ giúp người đọc hiểu rõ hơn về tầm quan trọng
của thiết bị này mà còn khơi gợi những ý tưởng sáng tạo, nghiên cứu và ứng dụng cánh
tay robot trong các lĩnh vực khác nhau của đời sống và sản xuất.
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 5/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
CHƯƠNG 2: NỘI DUNG
2.1 Cánh tay robot công nghiệp là gì?
• Cánh tay robot công nghiệp là một thiết bị hiện đại được lập trình để mô phỏng
các chuyển động của cánh tay con người. Với thiết kế bao gồm các khớp linh hoạt
di chuyển trên trục dọc và khả năng xoay theo nhiều hướng khác nhau, cánh tay
robot có thể hoạt động chính xác và hiệu quả trong nhiều môi trường làm việc.
• Mỗi cánh tay robot thường được chế tạo và lập trình để đảm nhận một nhiệm vụ
cụ thể, chẳng hạn như lắp ráp, hàn, sơn, hoặc vận chuyển. Tùy thuộc vào yêu cầu
công việc, kích thước của thiết bị này có thể được điều chỉnh. Các mẫu cánh tay
nhỏ gọn thường được sử dụng cho các thao tác tinh vi, đòi hỏi độ chính xác cao,
trong khi những mẫu lớn hơn lại đủ mạnh mẽ để nâng và xử lý các vật nặng.
• Nhờ tính linh hoạt và hiệu suất cao, cánh tay robot công nghiệp đang trở thành một
công cụ không thể thiếu trong ngành sản xuất và nhiều lĩnh vực khác, góp phần nâng
cao năng suất và giảm thiểu sai sót trong quá trình làm việc. lượng là khối lượng vật .
2.2 Cấu tạo
Với sự phát triển của khoa học công nghệ hiện nay cánh tay robot công nghiệp có nhiều
loại khác nhau, mỗi loại có những đặc điểm về cấu tạo riêng biệt. Cấu tạo của cánh tay
robot về cơ bạn bao gồm các bộ phận sau:
+ Tay máy: bao gồm khâu và khớp được cấu tạo mô phỏng với khả năng chuyển
động cơ bản Bao gồm cổ tay cử động dễ dàng, bàn tay thực hiện những thao tác và trực
tiếp hoàn thành công việc.
+ Hệ thống điều khiển: Đảm bảo nhiệm nhiệm vụ tiến hành những thao tác mỗi
khi có tín hiệu. Chúng vận hành từ đơn giản, giải quyết phương thức hành động chung
đến vị trí thao tác, những điểm đi qua. . . hoặc các hoạt động phức tạp như tính toán
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 6/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
động học, nội suy, xử lý lỗi, thiết lập quỹ đạo. . .
+ Phần mềm quản lý: Là môi trường lập trình và cũng là phương tiện để người
vận hành ra lệnh cho robot. Phần mềm đúng cần phải có một ngôn ngữ lập trình thích
hợp nhất, thân thiện và dễ dàng sử dụng.
2.3 Nguyên lý hoạt động
- Công việc của cánh tay chủ yếu là di chuyển sản phẩm, linh kiện từ nơi này sang
nơi khác. Cùng với đó là nhặt, nâng lên, đặt xuống, tháo ra, hàn hoặc tất cả công việc
đó. Nó được lập trình tự động để hoàn cảnh công việc mà người dùng mong muốn.
- Tùy theo ứng dụng vào công việc nào, robot sẽ được bổ sung các linh kiện cần thiết.
Nhưng robot sẽ luôn cần được trang bị thêm các bộ phận khác để hoạt động tốt hơn.
Đó có thể là: kẹp, mỏ hàn, đầu đánh bóng. Hoặc là các thiết bị cảm biến như: cảm biến
lực-mô-men, cảm biến an toàn, hệ thống quan sát.
- Robot giúp người dùng tự động hóa một quy trình. Quy trình đó có thể đang được
làm bằng cách thủ công. Hoặc nó có thể là một quy trình mới hoàn toàn.
- Có 2 yếu tố quan trọng trong hệ thống cánh tay robot:
+ Bộ điều khiển: điều khiển hoạt động của nó.
+ Teach Pendant: giúp lập trình cho robot.
2.4 Vai trò và ứng dụng
- Trong các nhà máy thông minh, cánh tay robot được ứng dụng cho nhiều mục đích
khác nhau. Với tốc độ cao, độ chính xác lớn, độ rung thấp, cánh tay robot không chỉ có
thể cải thiện đáng kể hoạt động sản xuất, giúp lắp ráp chính xác cao mà còn hoạt động
ổn định khi nó di chuyển nhanh chóng đến một địa điểm cụ thể.
- Một vài ứng dụng phổ biến của cánh tay robot công nghiệp:
+ Xếp chồng hàng hóa lên các pallet: Đây được gọi là dòng Robot Palletizing.
Cho phép dòng robot này có thể gắp hàng từ ray trượt rồi xếp chồng và lấp đầy vào các
pallet một cách tuần tự. Tay máy robot có khả năng di chuyển các vật liệu nặng như
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 7/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
sắt, thép, gỗ, giúp con người tránh nguy cơ gây thương tích.
+ Hàn cơ khí: Cánh tay robot công nghiệp ứng dụng vào hàn cơ khí, con người
được làm công việc an toàn hơn mà chất lượng mối hàn cũng được cải thiện.
+ Kiểm tra chất lượng: Robot được trang bị cảm biến, hệ thống nhận diện,
chụp ảnh bằng camera, và trí tuệ nhân tạo AI. Các dòng cánh tay robot này có khả
năng xác định các bộ phận bị lỗi trước khi thành phẩm được đóng gói hoặc vận chuyển.
Vì thế, doanh nghiệp có thể nâng cao công tác quản lý chất lượng trong thời gian thực,
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 8/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
ngay trên từng công đoạn sản xuất, giúp giảm thiểu lãng phí và thời gian chết.
+ Gắp, thả sản phẩm: Được trang bị hệ thống nhận diện để xác định đồ vật,
sau đó tự động nhặt đồ lên và đặt chúng lên bề mặt theo một vị trí và hướng đã định.
Hoạt động này thường được sử dụng để phân loại sản phẩm, lắp ráp, cho vào bao bì để
đóng gói, . . . một cách tự động, giúp gia tăng tốc độ sản xuất và phân phối hàng hóa.
2.5 Những thách thức và tương lai của cánh tay robot công nghiệp
- Những thách thức của cánh tay robot công nghiệp:
+ Chi phí đầu tư ban đầu cao: Việc mua sắm, lắp đặt, và bảo trì cánh tay
robot công nghiệp đòi hỏi chi phí lớn, khiến các doanh nghiệp nhỏ và vừa khó tiếp cận.
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 9/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
+ Yêu cầu kỹ thuật và trình độ cao: Việc vận hành và lập trình cánh tay
robot đòi hỏi đội ngũ nhân sự có trình độ chuyên môn, gây khó khăn trong quá trình
triển khai tại các khu vực thiếu nhân lực tay nghề cao.
+ Hạn chế trong linh hoạt: Mặc dù được lập trình linh hoạt, robot vẫn gặp khó
khăn trong các tình huống phức tạp hoặc yêu cầu thích nghi nhanh, đặc biệt trong môi
trường sản xuất thay đổi liên tục.
+ Phụ thuộc vào hệ thống cảm biến và nguồn năng lượng: Sự phụ thuộc
vào cảm biến và nguồn năng lượng khiến cánh tay robot dễ bị gián đoạn hoạt động nếu
xảy ra lỗi kỹ thuật hoặc mất điện.
+ Vấn đề bảo mật: Sự kết nối của robot với các hệ thống IoT và mạng lưới công
nghiệp làm gia tăng nguy cơ bị tấn công mạng, gây ảnh hưởng đến dữ liệu và hoạt động
sản xuất.
- Tương lai của cánh tay robot công nghiệp:
+ Tăng tính linh hoạt và thông minh: Sự phát triển của trí tuệ nhân tạo (AI)
và học máy (Machine Learning) sẽ giúp cánh tay robot xử lý tốt hơn các tác vụ phức
tạp và tự động học hỏi từ môi trường làm việc.
+ Giảm chi phí và tăng khả năng tiếp cận: Công nghệ tiên tiến sẽ giúp giảm
giá thành sản xuất, giúp các doanh nghiệp nhỏ và vừa dễ dàng triển khai robot hơn.
+ Tích hợp với công nghệ IoT: Cánh tay robot sẽ được kết nối với các hệ thống
IoT, cho phép quản lý và điều khiển từ xa, đồng thời tối ưu hóa hiệu quả sản xuất.
+ Ứng dụng trong đa lĩnh vực: Không chỉ giới hạn trong sản xuất, cánh tay
robot sẽ được áp dụng nhiều hơn trong y tế (phẫu thuật tự động), nông nghiệp (thu
hoạch thông minh), và dịch vụ (phục vụ khách hàng).
+ Thân thiện với môi trường: Sự phát triển của các nguồn năng lượng tái tạo
và công nghệ tiết kiệm năng lượng sẽ giúp cánh tay robot hoạt động bền vững hơn, góp
phần bảo vệ môi trường.
+ Tăng cường khả năng hợp tác với con người: Các robot cộng tác (Cobots)
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 10/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
sẽ phát triển mạnh, làm việc an toàn và hiệu quả bên cạnh con người trong các môi
trường sản xuất linh hoạt.
Với sự tiến bộ không ngừng của công nghệ, cánh tay robot công nghiệp hứa hẹn trở thành
một yếu tố then chốt, định hình lại tương lai của sản xuất và tự động hóa trên toàn thế giới.
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 11/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
CHƯƠNG 3: TRÌNH BÀY SẢN PHẨM
3.1 Nguyên liệu và dụng cụ chế tạo
Nguyên
liệu
SL Hình ảnh Thông số kỹ thuật
Thông số kích
thước
Gá U rộng 2
Độ bền kéo: 260 MPa.
Trọng lượng riêng: 2.7
g/cm.
Tải trọng chịu được:
100 kg.
Chịu nhiệt: -40°C đến
100°C.
Chiều dài: 10 cm đến
50 cm.
Chiều rộng: 5 cm đến
15 cm.
Chiều cao: 3 mm đến
10 mm.
Gá bắt
servo
3
Độ bền kéo: Khoảng
260 MPa.
Trọng lượng riêng:
Khoảng 2.7 g/cm.3
Đường kính lỗ khoan
gắn servo: 3 mm đến
6 mm.
Đường kính lỗ khoan
cố gắn vào khung: 4
mm đến 10 mm.
Chịu nhiệt: -40°C đến
100°C.
Chiều dài: 40 mm đến
120 mm.
Chiều rộng: Thường
từ 20 mm đến 50 mm.
Chiều cao: 3 mm đến
10 mm.
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 12/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
Nguyên
liệu
SL Hình ảnh Thông số kỹ thuật
Thông số kích
thước
Gá Servo
U dài
1
Lỗ khoan gắn servo: 3
mm đến 6 mm.
-Đường kính lỗ khoan
gắn vào khung: 4 mm
đến 8 mm.
- Vít và đinh ốc:
M3,M4,M5.
- Chiều dài: 80 mm
đến 250 mm.
- Chiều rộng: 20 mm
đến 50 mm.
- Chiều cao: 3 mm đến
10 mm.
Tay gắp
Robot
cho servo
995/996
1
- Góc quay: 0° đến
180°.
- Momen xoắn: 9,4
kg·cm ở 4.8V.
- Chiều dài: 150 mm
đến 250 mm.
- Chiều rộng: 50 mm
đến 100 mm.
- Khoảng cách mở
rộng: 50 mm đến 150
mm.
Đĩa servo
kim loại
2
- Đường kính đĩa: 20
mm đến 50 mm.
- Độ dày: 1 mm đến 5
mm.
- Lỗ lắp đặt: 3 mm đến
8 mm.
Vòng bi
bạc đạn
- Kích thước: 12 mm x
24 mm x 6 mm.
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 13/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
Nguyên
liệu
SL Hình ảnh Thông số kỹ thuật
Thông số kích
thước
Ốc vặn
- Kích thước: từ vài
mm đến vài cm.
Ốc M3*6
- Chiều dài: 6mm.
- Đường kính: 3mm.
Ốc M3*8
- Chiều dài: 8mm.
- Đường kính: 3mm.
Mạch điều
khiển
Arduino
Uno
1
- Tốc độ: 16MHz.
- Điện áp: 5V.
- Digital I/O Pins: 14
chân.
- Analog Inputs: 6
chân.
- Chân nguồn: Bao
gồm các chân 5V,
3.3V, GND, Vin và
AREF.
- LED tích hợp.
- Cổng I2C và SPI.
- Chiều dài: 68.6 mm.
- Chiều rộng: 53.4
mm.
- Chiều cao: 13.0 mm.
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 14/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
Nguyên
liệu
SL Hình ảnh Thông số kỹ thuật
Thông số kích
thước
Sensor
Shield
V5.0
1
- Chân I/O: analog
I/O, PWM, VCC và
GND.
- Chân kết nối cho
Servo: Hỗ trợ tối đa 4
servo.
- Chân kết nối cho motor.
- Giao tiếp I2C: SDA
và SCL.
- Chân 5V và 3.3V.
- Đầu vào Analog:
Cung cấp 6 chân analog.
- Giao tiếp UART:
Wifi, Bluetooth,. . .
- Chiều dài: Khoảng
57 mm.
- Chiều rộng: Khoảng
57 mm.
- Chiều cao: Khoảng
13 mm.
Cụm dây
nối
2 -Chiều dài: 10cm
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 15/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
Nguyên
liệu
SL Hình ảnh Thông số kỹ thuật
Thông số kích
thước
Cần điều
khiển
Joystick
2
- Điện áp: 2-3.6V.
- Độ phân giải:10-13
bit.
- Dải đo gia tốc: ±2g,
±4g, ±8g, ±16g.
- Giao tiếp: I2C và
SPI.
- Tốc độ lấy mẫu: 3200
samples per second.
- Độ nhạy: 256 LSB/g.
- Công suất tiêu thụ:
1.6Ma.
- Kích thước:3.9 mm x
3.8 mm.
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 16/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
3.2 Các bước thực hiện
a) Bước 1: Tiến hành lắp ráp robot 4 bậc tự do.
- Tiến hành lắp ráp 2 gá u rộng lại với nhau.
- Gắn gá bắt servo để lắp ráp động cơ 1.
- Gắn gá bắt servo để lắp ráp động cơ 2.
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 17/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
- Gắn gá chữ U để làm khớp cho cánh tay robot.
- Gắn gá bắt servo để lắp ráp động cơ 3.
- Lắp tay gắp và gắn động cơ servo để để khiển hành động kẹp, thả.
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 18/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
b) Bước 2: Sau khi hoàn thành phần cứng của cánh tay robot thì chúng em tiến hành
làm các bước cụ thể như sau:
Gọi 4 động cơ servo MG 996R lần lượt từ dưới đế lên tay gắp là 1,2,3,4 Lần lượt kết nối
4 động cơ với các chân nối tương ứng trên board mở rộng, chi tiết như sau:
Gọi 2 Công tắc joysticks trái và phải lần lượt là 4 và 5.
Lần lượt kết nối 2 Joysticks với các chân nối tương ứng trên board mở rộng, chi tiết như
sau:
- Công tắc 4: điều khiển động cơ 1 và 2.
+ Dây vàng: Analog A0.
+ Dây cam: Analog A1.
+ Dây xanh lá: 5V.
+ Dây xanh dương: GND.
-Công tắc 5: điều khiển động cơ 3 và 4:
+ Dây đen: Analog A2.
+ Dây trắng: Analog A3.
+ Dây nâu: 5V.
+ Dây đỏ: GND.
c) Bước 3: Lập trình điều khiển servo cánh tay robot bằng arduino ide.
1 #include <Servo.h> // Thư viện Servo giúp điều khiển servo motor
2 // Khai báo các servo
3 Servo servo1, servo2, servo3, servo4; // Khai báo 4 đối tượng servo tương
,→ ứng với 4 motor
4 // Cổng kết nối JoyStick
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 19/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
5 const int joy1X = A0, joy1Y = A1; // JoyStick 1: Trục X gắn vào A0, trục Y
,→ gắn vào A1
6 const int joy2X = A2, joy2Y = A3; // JoyStick 2: Trục X gắn vào A2, trục Y
,→ gắn vào A3
7 // Hàm chuyển đổi giá trị JoyStick thành góc servo
8 int mapJoystickToAngle(int joyValue) {
9 return map(joyValue, 0, 1023, 0, 180);
10 /*
11 Hàm map() chuyển đổi giá trị đọc từ JoyStick (0-1023)
12 thành góc quay servo (0°-180°).
13 Giá trị đầu vào (joyValue) là tín hiệu từ trục X hoặc Y của JoyStick.
14 */
15 }
16 void setup() {
17 // Gắn servo vào các chân PWM
18 servo1.attach(3); // Servo 1 điều khiển trên chân 3
19 servo2.attach(5); // Servo 2 điều khiển trên chân 5
20 servo3.attach(6); // Servo 3 điều khiển trên chân 6
21 servo4.attach(9); // Servo 4 điều khiển trên chân 9
22 // Đặt vị trí ban đầu của các servo (90° - ở giữa)
23 servo1.write(90); // Servo 1 ở góc 90° (vị trí trung tâm)
24 servo2.write(90); // Servo 2 ở góc 90° (vị trí trung tâm)
25 servo3.write(90); // Servo 3 ở góc 90° (vị trí trung tâm)
26 servo4.write(90); // Servo 4 ở góc 90° (vị trí trung tâm)
27 // Khởi tạo giao tiếp Serial để in giá trị
28 Serial.begin(9600);
29 // Khởi động Serial Monitor với tốc độ 9600 baud để xem giá trị JoyStick
30 }
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 20/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
31 void loop() {
32 // Đọc giá trị từ JoyStick 1
33 int joy1XValue = analogRead(joy1X); // Đọc tín hiệu trục X từ JoyStick 1
,→ (giá trị 0-1023)
34 int joy1YValue = analogRead(joy1Y); // Đọc tín hiệu trục Y từ JoyStick 1
,→ (giá trị 0-1023)
35 // Đọc giá trị từ JoyStick 2
36 int joy2XValue = analogRead(joy2X); // Đọc tín hiệu trục X từ JoyStick 2
,→ (giá trị 0-1023)
37 int joy2YValue = analogRead(joy2Y); // Đọc tín hiệu trục Y từ JoyStick 2
,→ (giá trị 0-1023)
38 }
39 // Điều khiển servo 1 và 2
40 servo1.write(mapJoystickToAngle(joy1XValue));
41 // Servo 1 nhận giá trị từ trục X của JoyStick 1
42 servo2.write(180 - mapJoystickToAngle(joy1YValue));
43 // Servo 2 nhận giá trị từ trục Y của JoyStick 1 (đảo chiều để phù hợp)
44 // Điều khiển servo 3 và 4
45 servo3.write(mapJoystickToAngle(joy2XValue));
46 // Servo 3 nhận giá trị từ trục X của JoyStick 2
47 servo4.write(mapJoystickToAngle(joy2YValue));
48 // Servo 4 nhận giá trị từ trục Y của JoyStick 2
49 // In giá trị JoyStick ra Serial Monitor
50 Serial.print("JoyStick 1 - X: ");
51 Serial.print(joy1XValue); // In giá trị trục X của JoyStick 1
52 Serial.print(" | Y: ");
53 Serial.print(joy1YValue); // In giá trị trục Y của JoyStick 1
54 Serial.print(" || JoyStick 2 - X: ");
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 21/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
55 Serial.print(joy2XValue); // In giá trị trục X của JoyStick 2
56 Serial.print(" | Y: ");
57 Serial.println(joy2YValue); // In giá trị trục Y của JoyStick 2 và xuống
,→ dòng
58 // Thêm chút trễ để servo hoạt động mượt mà hơn
59 delay(15);
60 // Giảm tần suất cập nhật giá trị để tránh nhiễu và giúp servo hoạt động
,→ mượt hơn
- Giải thích chi tiết đoạn code.
Thư viện và khai báo ban đầu.
• #include <Servo.h>: Thư viện Servo hỗ trợ giao tiếp và điều khiển động cơ servo
một cách dễ dàng.
• Servo servo1, servo2, servo3, servo4;: Khai báo 4 đối tượng servo tương ứng
với 4 motor.
Cổng kết nối joystick:
• const int joy1X = A0, joy1Y = A1; kết nối trục X và Y của joystick 1 vào chân
analog A0 và A1.
• const int joy2X = A2, joy2Y = A3; kết nối trục X và Y của joystick 2 vào chân
analog A2 và A3.
Hàm chuyển đổi giá trị joystick thành góc quay servo
1 int mapJoystickToAngle(int joyValue) {
2 return map(joyValue, 0, 1023, 0, 180);
3 }
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 22/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
Hàm mapJoystickToAngle() thực hiện chuyển đổi giá trị đọc từ joystick (trong khoảng 0
đến 1023) sang góc quay servo (trong khoảng 0° đến 180°), nhờ hàm map() của Arduino.
Thiết lập trong hàm setup()
• Gắn động cơ servo vào các chân PWM (kỹ thuật điều chế độ rộng xung) của Arduino:
1 servo1.attach(3); // Servo 1 điều khiển chân số 3
2 servo2.attach(5); // Servo 2 điều khiển chân số 5
3 servo3.attach(6); // Servo 3 điều khiển chân số 6
4 servo4.attach(9); // Servo 4 điều khiển chân số 9
• Đặt vị trí ban đầu cho tất cả các servo ở vị trí trung tâm (90°):
1 servo1.write(90);
2 servo2.write(90);
3 servo3.write(90);
4 servo4.write(90);
• Khởi tạo giao tiếp qua Serial Monitor để in giá trị đọc từ joystick:
1 Serial.begin(9600);
Vòng lặp loop()
• Đọc giá trị tín hiệu từ joystick:
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 23/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
1 int joy1XValue = analogRead(joy1X); // Giá trị trục X của joystick 1
2 int joy1YValue = analogRead(joy1Y); // Giá trị trục Y của joystick 1
3
4 int joy2XValue = analogRead(joy2X); // Giá trị trục X của joystick 2
5 int joy2YValue = analogRead(joy2Y); // Giá trị trục Y của joystick 2
Sử dụng hàm analogRead() để lấy tín hiệu từ joystick với giá trị từ 0 đến 1023.
• Điều khiển servo dựa trên giá trị joystick:
1 servo1.write(mapJoystickToAngle(joy1XValue)); // Servo 1: trục X của
,→ joystick 1
2 servo2.write(180 - mapJoystickToAngle(joy1YValue)); // Servo 2: trục Y
,→ (đảo chiều)
3 servo3.write(mapJoystickToAngle(joy2XValue)); // Servo 3: trục X của
,→ joystick 2
4 servo4.write(mapJoystickToAngle(joy2YValue)); // Servo 4: trục Y của
,→ joystick 2
• In giá trị joystick qua Serial Monitor:
1 Serial.print("JoyStick 1 - X: ");
2 Serial.print(joy1XValue);
3 Serial.print(" | Y: ");
4 Serial.print(joy1YValue);
5
6 Serial.print(" || JoyStick 2 - X: ");
7 Serial.print(joy2XValue);
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 24/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
8 Serial.print(" | Y: ");
9 Serial.println(joy2YValue);
• Thêm độ trễ nhỏ (15ms) để servo hoạt động mượt hơn:
1 delay(15);
Tóm tắt hoạt động
• Joystick 1:
– Trục X điều khiển servo 1.
– Trục Y điều khiển servo 2 (đảo chiều góc quay).
• Joystick 2:
– Trục X điều khiển servo 3.
– Trục Y điều khiển servo 4.
• Giá trị joystick được đọc, chuyển đổi thành góc servo, và in ra Serial Monitor.
d) Bước 4: Chạy thử và kiểm tra sai sót.
e) Bước 5: Báo cáo và hoàn thiện sản phẩm.
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 25/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
BẢNG THIẾT KẾ MẠCH ĐIỆN VÀ SẢN PHẨM
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 26/27
Trường Đại Học Bách Khoa - ĐHQG TP.HCM
Khoa Khoa học ứng dụng
TÀI LIỆU THAM KHẢO
Tài liệu
[1] Arduino VN. (n.d.). Học ngôn ngữ lập trình Arduino IDE, xem tài liệu cánh tay
robot 6 bậc tự do.
[2] Trần, T. T., Nguyễn, V. T., Đinh, T. P. T., Trần, V. M. (2023). Phát triển nguyên
mẫu cánh tay robot 6 bậc tự do. Results in Engineering, 17, 101049. https://doi.
org/10.1016/j.rineng.2023.101049
[3] YouTube. (2021, December 10). Học cách lắp ráp cánh tay robot. YouTube.
https://www.youtube.com/watch?v=-FjV9QgVF6A
[4] Last Minute Engineers. (n.d.). Học cách sử dụng Joysticks (nút nhấn đa hướng),
động cơ servo, và Arduino Uno. https://lastminuteengineers.com
[5] YouTube. (2022, March 15). Học cách sử dụng Joystick để điều khiển động cơ servo.
YouTube. https://www.youtube.com/watch?v=Z7HWoh_MR1s
Báo cáo Ngày hội Kỹ thuật
Niên khoá 2024 - 2025
Trang 27/27