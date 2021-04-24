document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    const flagScore = document.querySelector('#flagtxt')
    let width = 10;
    let bombAmount = 20;
    let squares = [];
    let flagCount = 0;
    let checkedBox = 0;
    let isGameOver = false;

    //create board
    function createBoard() {
        //get shuffled array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)



        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i]) //Bomba var mı yok mu onu sınıf olarak ekledik
            square.style = "position: relative;";
            grid.appendChild(square)
            squares.push(square)

            //normal click
            square.addEventListener('click', function (e) {
                click(square);

            })

            square.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                addFlag(square);
                return false;
            }, false);
        }

        //add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width - 1)


            if (squares[i].classList.contains('valid')) {

                //Sol kutu check
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) {
                    total++;
                }

                //Sol üst kutu check
                if (i > width && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) {
                    total++;
                }

                //Sol alt kutu check
                if (i < width * width - width && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) {
                    total++;
                }

                //Üst Kutu Check
                if (i > width && squares[i - width].classList.contains('bomb')) {
                    total++;
                }

                //Alt kutu check
                if (i < width * width - width && squares[i + width].classList.contains('bomb')) {
                    total++;
                }

                //Sağ kutu check
                if (i >= 0 && !isRightEdge && squares[i + 1].classList.contains('bomb')) {
                    total++;
                }

                //Sağ üst kutu check
                if (i >= width && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) {
                    total++;
                }

                //Sağ alt kutu check
                if (i < width * width - width && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) {
                    total++;
                }
                squares[i].setAttribute('data', total)

            } else {
                squares[i].setAttribute('data', 'X')
            }

        }


    };
    createBoard();

    //click on square
    function click(sqr) {
        let currentId = sqr.id
        if (isGameOver) return
        if (sqr.classList.contains('checked') || sqr.classList.contains('flag')) return


        if (sqr.classList.contains('bomb')) { //Bomba bulunan kutuya basıldığı zaman
            isGameOver = true;
            openBoard();
            alert('Game Over')
        } else { //Üzerinde bomba bulunmayan kutu
            checkedBox++;
            let total = sqr.getAttribute('data');
            if (total != 0) { //Kutunun etrafında en az 1 adet bomba varsa
                sqr.classList.add('checked');
                sqr.innerHTML = `<p style="position:absolute; margin:30% 40%">${total}</p>`;
                checkForWin();
                return
            }

            checkSquare(sqr, currentId) //Eğer etrafında bomba yoksa recursive olarak o kutuyu kontrol etme
            checkForWin();
            sqr.classList.add('checked')
        }

    }

    //check neighbouring squares
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)


        setTimeout(() => {
            //Sol
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id;
                const newSquare = document.getElementById(newId);

                if (newSquare.classList.contains('flag')) {
                    newSquare.removeChild(newSquare.childNodes[0]);
                    newSquare.classList.remove('flag');
                    flagCount--;
                    changeFlagCount(flagCount);
                }

                click(newSquare)
            }
            //Sol üst
            if (currentId > width - 1 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id
                const newSquare = document.getElementById(newId)

                if (newSquare.classList.contains('flag')) {
                    newSquare.removeChild(newSquare.childNodes[0]);
                    newSquare.classList.remove('flag');
                    flagCount--;
                    changeFlagCount(flagCount);
                }

                click(newSquare)
            }

            //Sol Alt
            if (currentId < width * width - width && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id
                const newSquare = document.getElementById(newId)
                if (newSquare.classList.contains('flag')) {
                    newSquare.removeChild(newSquare.childNodes[0]);
                    newSquare.classList.remove('flag');
                    flagCount--;
                    changeFlagCount(flagCount);
                }

                click(newSquare)
            }

            //Alt
            if (currentId < width * width - width) {
                const newId = squares[parseInt(currentId) + width].id
                const newSquare = document.getElementById(newId)
                if (newSquare.classList.contains('flag')) {
                    newSquare.removeChild(newSquare.childNodes[0]);
                    newSquare.classList.remove('flag');
                    flagCount--;
                    changeFlagCount(flagCount);
                }
                click(newSquare)
            }

            //Üst

            if (currentId > width - 1) {
                const newId = squares[parseInt(currentId) - width].id
                const newSquare = document.getElementById(newId)
                if (newSquare.classList.contains('flag')) {
                    newSquare.removeChild(newSquare.childNodes[0]);
                    newSquare.classList.remove('flag');
                    flagCount--;
                    changeFlagCount(flagCount);
                }
                click(newSquare)
            }

            //Sağ
            if (currentId > 0 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id
                const newSquare = document.getElementById(newId)
                if (newSquare.classList.contains('flag')) {
                    newSquare.removeChild(newSquare.childNodes[0]);
                    newSquare.classList.remove('flag');
                    flagCount--;
                    changeFlagCount(flagCount);
                }
                click(newSquare)
            }

            //Sağ Üst
            if (currentId > width - 1 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id
                const newSquare = document.getElementById(newId)
                if (newSquare.classList.contains('flag')) {
                    newSquare.removeChild(newSquare.childNodes[0]);
                    newSquare.classList.remove('flag');
                    flagCount--;
                    changeFlagCount(flagCount);
                }
                click(newSquare)
            }

            //Sağ Alt
            if (currentId < width * width - width && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id
                const newSquare = document.getElementById(newId)
                if (newSquare.classList.contains('flag')) {
                    newSquare.removeChild(newSquare.childNodes[0]);
                    newSquare.classList.remove('flag');
                    flagCount--;
                    changeFlagCount(flagCount);
                }
                click(newSquare)
            }



        }, 10)
    }

    function addFlag(sqr) {

        //Eğer kutu çoktan check edilmişse veya oyun bittiyse. Direkt fonksiyondan çıkar

        if ((sqr.classList.contains('checked')) || (isGameOver)) {

            return;
        }

        //Eğer tıklanan kutu bayrak içermiyorsa bayrak eklenir.
        if (!sqr.classList.contains("flag") && flagCount != bombAmount) {
            const flag = document.createElement('img');
            flag.src = "flags.png";
            flag.style = "width:40px;height:40px;"
            sqr.appendChild(flag);
            sqr.classList.add("flag");
            flagCount++;
        } else {
            sqr.removeChild(sqr.childNodes[0]);
            sqr.classList.remove("flag");
            flagCount--;
        }
        changeFlagCount(flagCount);
    }

    function changeFlagCount(newCount) {
        const txt = `Flag Count = ${newCount}`
        flagScore.innerHTML = txt;
    }

    //Eğer kontrol edilen kutu sayısı ve bomba sayısı eşit ise oyun kazanılır.
    function checkForWin() {
        if (checkedBox + bombAmount == width * width) {
            alert('Congratulations!! You Win!!')
            isGameOver = true;
            const winctx = document.querySelector('#winContext');
            winctx.classList.toggle('hide');
        }
    }

    function openBoard() {
        squares.forEach((sqr) => {
            if (!sqr.classList.contains('checked')) {
                let total = sqr.getAttribute('data');
                sqr.classList.add('checked');
                if (total != 0) {
                    sqr.innerHTML = `<p style="position:absolute; margin:30% 40%">${total}</p>`;
                }
            }
            if (sqr.classList.contains('bomb')) {
                let total = sqr.getAttribute('data');
                sqr.classList.toggle('openBomb');
                sqr.innerHTML = `<p style="position:absolute; margin:30% 40%">${total}</p>`;
            }
        });
    }
})