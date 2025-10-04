 let currentStep = 1;
        let currentGenre = 'samba';
        let isPlaying = false;
        let progress = 0;
        let progressInterval;
        let currentPose = 'neutral';
        let dancerIdCounter = 0;
        let stageDancers = [];

        // Menu lateral
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const overlay = document.getElementById('overlay');

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            mainContent.classList.toggle('shifted');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            mainContent.classList.remove('shifted');
            overlay.classList.remove('active');
        });

        // Stage Functions - CÓDIGO SECUNDÁRIO APLICADO COM CORREÇÕES PARA MOBILE
        function openStage() {
            document.getElementById('stageModal').classList.add('active');
            overlay.classList.add('active');
            sidebar.classList.remove('open');
            mainContent.classList.remove('shifted');

            // Previne scroll do body quando o palco está aberto
            document.body.style.overflow = 'hidden';
        }

        function closeStage() {
            document.getElementById('stageModal').classList.remove('active');
            overlay.classList.remove('active');

            // Restaura scroll do body
            document.body.style.overflow = '';
        }

        // Drag and Drop Functions - CÓDIGO SECUNDÁRIO COM CORREÇÕES PARA MOBILE
        function dragStart(event) {
            const color = event.target.closest('.dancer-item').dataset.color;
            event.dataTransfer.setData('color', color);
            event.dataTransfer.effectAllowed = 'copy';
            
            // Para mobile - armazena dados para touch
            if (event.type === 'touchstart') {
                event.currentTarget.setAttribute('data-color', color);
            }
        }

        function allowDrop(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        }

        function drop(event) {
            event.preventDefault();
            const color = event.dataTransfer.getData('color');
            const stageContainer = document.getElementById('stageContainer');
            const rect = stageContainer.getBoundingClientRect();
            
            // Para ambos desktop e mobile
            let clientX, clientY;
            
            if (event.type === 'touchend') {
                const touch = event.changedTouches[0];
                clientX = touch.clientX;
                clientY = touch.clientY;
            } else {
                clientX = event.clientX;
                clientY = event.clientY;
            }
            
            const x = clientX - rect.left - 25;
            const y = clientY - rect.top - 35;
            
            createDancerOnStage(x, y, color);
        }

        function createDancerOnStage(x, y, color) {
            const dancer = document.createElement('div');
            dancer.className = 'stage-dancer';
            dancer.id = 'dancer-' + dancerIdCounter++;
            dancer.style.left = x + 'px';
            dancer.style.top = y + 'px';
            
            // Create delete button
            const deleteBtn = document.createElement('div');
            deleteBtn.className = 'dancer-delete';
            deleteBtn.innerHTML = '×';
            deleteBtn.onclick = function() {
                removeDancer(dancer.id);
            };
            
            // Create SVG element properly
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 50 70');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.style.display = 'block';
            
            // Create circle (head)
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '25');
            circle.setAttribute('cy', '10');
            circle.setAttribute('r', '8');
            circle.setAttribute('fill', color);
            
            // Create body line
            const bodyLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            bodyLine.setAttribute('x1', '25');
            bodyLine.setAttribute('y1', '18');
            bodyLine.setAttribute('x2', '25');
            bodyLine.setAttribute('y2', '45');
            bodyLine.setAttribute('stroke', color);
            bodyLine.setAttribute('stroke-width', '3');
            bodyLine.setAttribute('stroke-linecap', 'round');
            
            // Create left arm
            const leftArm = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            leftArm.setAttribute('x1', '25');
            leftArm.setAttribute('y1', '25');
            leftArm.setAttribute('x2', '15');
            leftArm.setAttribute('y2', '35');
            leftArm.setAttribute('stroke', color);
            leftArm.setAttribute('stroke-width', '3');
            leftArm.setAttribute('stroke-linecap', 'round');
            
            // Create right arm
            const rightArm = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            rightArm.setAttribute('x1', '25');
            rightArm.setAttribute('y1', '25');
            rightArm.setAttribute('x2', '35');
            rightArm.setAttribute('y2', '35');
            rightArm.setAttribute('stroke', color);
            rightArm.setAttribute('stroke-width', '3');
            rightArm.setAttribute('stroke-linecap', 'round');
            
            // Create left leg
            const leftLeg = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            leftLeg.setAttribute('x1', '25');
            leftLeg.setAttribute('y1', '45');
            leftLeg.setAttribute('x2', '15');
            leftLeg.setAttribute('y2', '65');
            leftLeg.setAttribute('stroke', color);
            leftLeg.setAttribute('stroke-width', '3');
            leftLeg.setAttribute('stroke-linecap', 'round');
            
            // Create right leg
            const rightLeg = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            rightLeg.setAttribute('x1', '25');
            rightLeg.setAttribute('y1', '45');
            rightLeg.setAttribute('x2', '35');
            rightLeg.setAttribute('y2', '65');
            rightLeg.setAttribute('stroke', color);
            rightLeg.setAttribute('stroke-width', '3');
            rightLeg.setAttribute('stroke-linecap', 'round');
            
            // Append all elements to SVG
            svg.appendChild(circle);
            svg.appendChild(bodyLine);
            svg.appendChild(leftArm);
            svg.appendChild(rightArm);
            svg.appendChild(leftLeg);
            svg.appendChild(rightLeg);
            
            // Append to dancer container
            dancer.appendChild(deleteBtn);
            dancer.appendChild(svg);
            
            // Make dancer draggable on stage - PARA DESKTOP
            dancer.draggable = true;
            dancer.addEventListener('dragstart', function(e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('dancerId', dancer.id);
                dancer.classList.add('dragging');
            });
            
            dancer.addEventListener('dragend', function() {
                dancer.classList.remove('dragging');
            });
            
            // SUPPORT PARA MOBILE - TOUCH EVENTS
            let isDragging = false;
            let startX, startY, initialX, initialY;
            
            dancer.addEventListener('touchstart', function(e) {
                isDragging = true;
                const touch = e.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
                initialX = parseInt(dancer.style.left) || 0;
                initialY = parseInt(dancer.style.top) || 0;
                dancer.classList.add('dragging');
                e.preventDefault();
            }, { passive: false });
            
            dancer.addEventListener('touchmove', function(e) {
                if (!isDragging) return;
                const touch = e.touches[0];
                const deltaX = touch.clientX - startX;
                const deltaY = touch.clientY - startY;
                
                const stageContainer = document.getElementById('stageContainer');
                const rect = stageContainer.getBoundingClientRect();
                
                let newX = initialX + deltaX;
                let newY = initialY + deltaY;
                
                // Limita ao palco
                newX = Math.max(0, Math.min(newX, rect.width - 50));
                newY = Math.max(0, Math.min(newY, rect.height - 70));
                
                dancer.style.left = newX + 'px';
                dancer.style.top = newY + 'px';
                
                e.preventDefault();
            }, { passive: false });
            
            dancer.addEventListener('touchend', function() {
                isDragging = false;
                dancer.classList.remove('dragging');
                
                // Atualiza posição no array
                const dancerData = stageDancers.find(d => d.id === dancer.id);
                if (dancerData) {
                    dancerData.x = parseInt(dancer.style.left);
                    dancerData.y = parseInt(dancer.style.top);
                }
            });
            
            document.getElementById('stageContainer').appendChild(dancer);
            stageDancers.push({ id: dancer.id, x, y, color });
        }

        // SUPPORT PARA MOBILE - ARRASTAR DA PALETA
        document.querySelectorAll('.dancer-item').forEach(item => {
            // Touch events para mobile
            item.addEventListener('touchstart', function(e) {
                const color = this.dataset.color;
                this.setAttribute('data-color', color);
                e.preventDefault();
            }, { passive: false });
            
            item.addEventListener('touchend', function(e) {
                const color = this.getAttribute('data-color');
                if (color) {
                    const stageContainer = document.getElementById('stageContainer');
                    const rect = stageContainer.getBoundingClientRect();
                    const touch = e.changedTouches[0];
                    
                    const x = touch.clientX - rect.left - 25;
                    const y = touch.clientY - rect.top - 35;
                    
                    // Verifica se o toque foi dentro do palco
                    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                        createDancerOnStage(x, y, color);
                    }
                }
                e.preventDefault();
            }, { passive: false });
        });

        // Allow repositioning dancers on stage
        document.getElementById('stageContainer').addEventListener('drop', function(event) {
            event.preventDefault();
            const dancerId = event.dataTransfer.getData('dancerId');
            
            if (dancerId) {
                const dancer = document.getElementById(dancerId);
                if (dancer) {
                    const stageContainer = document.getElementById('stageContainer');
                    const rect = stageContainer.getBoundingClientRect();
                    
                    const x = event.clientX - rect.left - 25;
                    const y = event.clientY - rect.top - 35;
                    
                    dancer.style.left = x + 'px';
                    dancer.style.top = y + 'px';
                    
                    // Update position in array
                    const dancerData = stageDancers.find(d => d.id === dancerId);
                    if (dancerData) {
                        dancerData.x = x;
                        dancerData.y = y;
                    }
                }
            }
        });

        function removeDancer(dancerId) {
            const dancer = document.getElementById(dancerId);
            if (dancer) {
                dancer.remove();
                stageDancers = stageDancers.filter(d => d.id !== dancerId);
            }
        }

        function clearStage() {
            const dancers = document.querySelectorAll('.stage-dancer');
            dancers.forEach(dancer => dancer.remove());
            stageDancers = [];
        }

        function saveCoreography() {
            if (stageDancers.length === 0) {
                alert('Adicione pelo menos um dançarino ao palco!');
                return;
            }
            
            const coreography = {
                dancers: stageDancers,
                timestamp: new Date().toISOString()
            };
            
            const data = JSON.stringify(coreography, null, 2);
            alert('Coreografia salva com sucesso! Total de dançarinos: ' + stageDancers.length);
            console.log('Coreografia salva:', data);
        }

        function animateDancers() {
            const dancers = document.querySelectorAll('.stage-dancer svg');
            
            if (dancers.length === 0) {
                alert('Adicione dançarinos ao palco primeiro!');
                return;
            }
            
            dancers.forEach((svg, index) => {
                setTimeout(() => {
                    svg.style.animation = 'dance 1s ease-in-out';
                    setTimeout(() => {
                        svg.style.animation = '';
                    }, 1000);
                }, index * 200);
            });
        }

        // Função para mostrar os textos dos fundamentos
        function showFundamentalText(fundamental) {
            const buttons = document.querySelectorAll('.figure-btn');
            const texts = document.querySelectorAll('.fundamental-text');

            // Remove classes ativas
            buttons.forEach(btn => btn.classList.remove('active'));
            texts.forEach(text => text.classList.remove('active'));

            // Ativa o botão clicado
            event.target.classList.add('active');

            // Mostra o texto correspondente
            document.getElementById(`text-${fundamental}`).classList.add('active');

            // Atualiza o passo atual baseado no fundamental
            const stepMap = {
                'rhythm': 1,
                'weight': 2,
                'knees': 3,
                'posture': 4,
                'space': 5,
                'coordination': 6
            };

            if (stepMap[fundamental]) {
                selectStep(stepMap[fundamental]);
            }
        }

        function selectStep(step) {
            currentStep = step;

            // Remove active class from all steps
            document.querySelectorAll('.step-card').forEach(card => {
                card.classList.remove('active');
            });

            // Add active class to selected step
            document.querySelectorAll('.step-card')[step - 1].classList.add('active');

            // Atualiza automaticamente o texto do fundamental baseado no passo selecionado
            const textMap = {
                1: 'rhythm',
                2: 'weight',
                3: 'knees',
                4: 'posture',
                5: 'space',
                6: 'coordination'
            };

            if (textMap[step]) {
                const buttons = document.querySelectorAll('.figure-btn');
                const texts = document.querySelectorAll('.fundamental-text');

                // Remove classes ativas
                buttons.forEach(btn => btn.classList.remove('active'));
                texts.forEach(text => text.classList.remove('active'));

                // Ativa o botão e texto correspondentes
                document.querySelector(`.figure-btn:nth-child(${step})`).classList.add('active');
                document.getElementById(`text-${textMap[step]}`).classList.add('active');
            }

            // Update instruction (mantenha as instruções originais se quiser)
            const instructions = {
                1: "Percepção Rítmica: Feche os olhos e tente identificar a batida principal da música. Conte mentalmente: 1, 2, 3, 4...",
                2: "Controle de Peso: Pratique transferir seu peso suavemente de um pé para o outro, mantendo o equilíbrio.",
                3: "Flexão de Joelhos: Mantenha os joelhos levemente flexionados - isso dá mobilidade e absorve impactos.",
                4: "Postura Corporal: Imagine uma linha reta da orelha até o tornozelo. Mantenha o peito aberto e ombros relaxados.",
                5: "Consciência Espacial: Esteja ciente do espaço ao seu redor. Pratique movimentos sem olhar para os pés.",
                6: "Coordenação Motora: Comece com movimentos simples de braços e pernas, depois combine-os gradualmente."
            };

            document.getElementById('instructionText').textContent = instructions[step];
        }

        // Função auxiliar para obter o nome da pose
        function getPoseName(pose) {
            const poseNames = {
                'neutral': 'Posição Neutra',
                'rhythm': 'Percepção Rítmica',
                'weight': 'Controle de Peso',
                'posture': 'Postura'
            };
            return poseNames[pose] || 'Posição Neutra';
        }

        function selectGenre(genre) {
            currentGenre = genre;

            // Remove active class from all genres
            document.querySelectorAll('.genre-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Add active class to selected genre
            event.target.classList.add('active');

            // Update song info based on genre
            const genreData = {
                'samba': {
                    title: 'Samba no Pé - Coreografia',
                    artist: 'FitDance/Cia de Dança',
                    instruction: 'Samba selecionado! Aplique os fundamentos básicos neste ritmo brasileiro.',
                    videoSrc: 'https://www.youtube.com/embed/ZcdAc2eP5ic?si=BkI39mNIyS7jLgw_',
                    tips: [
                        'Mantenha os joelhos levemente flexionados para facilitar o movimento dos quadris',
                        'O gingado do samba vem da alternância de peso entre os pés',
                        'Mantenha os braços soltos para acompanhar o balanço do corpo',
                        'Pratique o passo básico até dominar o ritmo antes de adicionar variações'
                    ]
                },
                'forro': {
                    title: 'Bicho do Mato (Rastapé) - Forró',
                    artist: 'Coreografia de Forró/Rastapé',
                    instruction: 'Forró selecionado! Observe como os fundamentos se aplicam a este estilo.',
                    videoSrc: 'https://www.youtube.com/embed/bjBx8aOJuq0?si=6pkyuV57pNWvG_nk',
                    tips: [
                        'Mantenha os pés próximos ao chão, deslizando suavemente',
                        'O cavalheiro conduz com as mãos na cintura da parceira',
                        'A dama deve seguir a condução mantendo contato visual',
                        'Pratique o dois pra lá e dois pra cá até sentir o ritmo'
                    ]
                },
                'pagode': {
                    title: 'aviões do forro',
                    artist: 'xande avião',
                    instruction: 'Pagode selecionado! Perceba a aplicação dos fundamentos neste estilo.',
                    videoSrc: 'https://www.youtube.com/embed/mIMGgP1QZ30?si=Hvc8C2tPwSWAzWzh',
                    tips: [
                        'O pagode tem um gingado mais suave que o samba',
                        'Mantenha os braços soltos e use-os para equilibrar o movimento',
                        'Os pés fazem movimentos curtos e rápidos',
                        'Pratique o "balanço da navalha" movendo os quadris em oito'
                    ]
                },
                'funk': {
                    title: 'Baile de Favela - MC João',
                    artist: 'Coreografia Daniel Saboya',
                    instruction: 'Funk selecionado! Veja como os fundamentos se adaptam a este estilo urbano.',
                    videoSrc: 'https://www.youtube.com/embed/vPbHG1YZuoI?si=yYsWqGc5ArTaH5YO',
                    tips: [
                        'Foque nos movimentos de quadris e pernas',
                        'Mantenha os joelhos flexionados para facilitar os rebolados',
                        'Use os braços para dar ênfase aos movimentos principais',
                        'Pratique cada movimento separadamente antes de combiná-los'
                    ]
                },
                'street': {
                    title: 'Pump It - Black Eyed Peas',
                    artist: 'Coreografia Street Dance',
                    instruction: 'Street Dance selecionado! Observe a aplicação dos fundamentos básicos.',
                    videoSrc: 'https://www.youtube.com/embed/ak-oaLEnyZE?si=xOPt7yrBbb0a8Y55',
                    tips: [
                        'Mantenha uma postura baixa com joelhos flexionados',
                        'Trabalhe o isolamento de diferentes partes do corpo',
                        'Pratique os movimentos no espelho para corrigir a postura',
                        'Combine passos básicos antes de tentar sequências complexas'
                    ]
                },
                'contemporanea': {
                    title: 'Caminhos',
                    artist: 'Trio contemporâneo',
                    instruction: 'Dança Contemporânea! Veja como os fundamentos se expressam neste estilo.',
                    videoSrc: 'https://www.youtube.com/embed/608X9hCYc_E?si=jNG3CvqpAhoGjieo',
                    tips: [
                        'Foque na fluidez e conexão entre os movimentos',
                        'Trabalhe a respiração sincronizada com os movimentos',
                        'Use o espaço de forma consciente e expressiva',
                        'Pratique a queda e recuperação para desenvolver controle'
                    ]
                },
                'axe': {
                    title: 'Segure o Tchan - É O Tchan',
                    artist: 'Coreografia É o Tchan',
                    instruction: 'Axé selecionado! Aplique os fundamentos neste ritmo energético.',
                    videoSrc: 'https://www.youtube.com/embed/YWxiK7TFN5k?si=h3LysiTBkCCnItzh',
                    tips: [
                        'Mantenha alta energia e sorriso no rosto',
                        'Os movimentos são amplos e alegres',
                        'Trabalhe a coordenação de braços e pernas',
                        'Pratique os passos marcando o ritmo forte do axé'
                    ]
                },
                'dance': {
                    title: 'One More Time - Daft Punk',
                    artist: 'Coreografia Dance/House',
                    instruction: 'Dance eletrônica! Observe a aplicação dos fundamentos neste estilo.',
                    videoSrc: 'https://www.youtube.com/embed/4l8vDGLwWes?si=LenyO8jKXQIiUE81',
                    tips: [
                        'Mantenha o ritmo com movimentos precisos',
                        'Trabalhe a memória coreográfica repetindo sequências',
                        'Use todo o corpo, não apenas as pernas',
                        'Pratique com contagens musicais para melhor sincronização'
                    ]
                }
            };

            const data = genreData[genre];
            document.getElementById('songTitle').textContent = data.title;
            document.getElementById('songArtist').textContent = data.artist;
            document.getElementById('instructionText').textContent = data.instruction;

            // Update choreography video and tips
            updateChoreography(data);
        }

        function updateChoreography(data) {
            const videoElement = document.querySelector('.choreography-video');
            const tipsElement = document.querySelector('.choreography-tips');

            // Update video source
            if (data.videoSrc) {
                videoElement.src = data.videoSrc;
            }

            // Update tips
            tipsElement.innerHTML = `<h3>Dicas para esta coreografia:</h3><ul>`;
            data.tips.forEach(tip => {
                tipsElement.innerHTML += `<li>${tip}</li>`;
            });
            tipsElement.innerHTML += `</ul>`;
        }

        function startSequence() {
            document.getElementById('instructionText').textContent = 'Iniciando sequência de fundamentos! Pratique cada elemento por 30 segundos.';

            let currentSequenceStep = 1;
            const sequenceInterval = setInterval(() => {
                selectStep(currentSequenceStep);
                currentSequenceStep++;

                if (currentSequenceStep > 6) {
                    clearInterval(sequenceInterval);
                    document.getElementById('instructionText').textContent = 'Sequência completa! Parabéns por praticar todos os fundamentos! 🎉';
                }
            }, 5000); // 5 segundos para cada fundamento
        }

        function startSession() {
            document.getElementById('instructionText').textContent = `Sessão de ${currentGenre.toUpperCase()} iniciada! Aplique os fundamentos básicos enquanto acompanha a coreografia! 🎵`;
            playPause();
        }

        function playPause() {
            isPlaying = !isPlaying;
            const playBtn = document.getElementById('playBtn');

            if (isPlaying) {
                playBtn.textContent = '⏸';
                startProgress();
            } else {
                playBtn.textContent = '▶';
                stopProgress();
            }
        }

        function startProgress() {
            progressInterval = setInterval(() => {
                progress += 1;
                if (progress >= 100) {
                    progress = 0;
                }
                document.getElementById('progress').style.width = progress + '%';
            }, 100);
        }

        function stopProgress() {
            clearInterval(progressInterval);
        }

        function previousTrack() {
            progress = 0;
            document.getElementById('progress').style.width = '0%';
            document.getElementById('instructionText').textContent = 'Música anterior selecionada! Continue aplicando os fundamentos.';
        }

        function nextTrack() {
            progress = 0;
            document.getElementById('progress').style.width = '0%';
            document.getElementById('instructionText').textContent = 'Próxima música selecionada! Aplique os fundamentos neste novo ritmo.';
        }

        // Auto-update instructions every 5 seconds when playing
        setInterval(() => {
            if (isPlaying) {
                const tips = [
                    'Lembre-se de respirar profundamente durante os movimentos!',
                    'Mantenha os joelhos flexionados para maior estabilidade!',
                    'Foque na transferência suave de peso entre os pés!',
                    'Observe sua postura no espelho e faça ajustes!',
                    'Sinta a música e deixe o corpo fluir naturalmente!'
                ];
                const currentInstruction = document.getElementById('instructionText').textContent;
                // Only change if it's not a step-specific instruction
                if (!currentInstruction.includes('Percepção Rítmica:') &&
                    !currentInstruction.includes('Controle de Peso:') &&
                    !currentInstruction.includes('Flexão de Joelhos:') &&
                    !currentInstruction.includes('Postura Corporal:') &&
                    !currentInstruction.includes('Consciência Espacial:') &&
                    !currentInstruction.includes('Coordenação Motora:')) {
                    const randomIndex = Math.floor(Math.random() * tips.length);
                    document.getElementById('instructionText').textContent = tips[randomIndex];
                }
            }
        }, 5000);

        // Initial setup for the first video
        document.addEventListener('DOMContentLoaded', () => {
            selectGenre('samba');
            selectStep(1); // Select the first step card
            showFundamentalText('rhythm'); // Show the first fundamental text
        });

        // Quiz Variables
        let quizAnswers = {};
        let currentQuizQuestion = 1;

        // Quiz Functions
        function openQuiz() {
            document.getElementById('quizModal').classList.add('active');
            overlay.classList.add('active');
            sidebar.classList.remove('open');
            mainContent.classList.remove('shifted');
            resetQuiz();
        }

        function closeQuiz() {
            document.getElementById('quizModal').classList.remove('active');
            overlay.classList.remove('active');
        }

        function resetQuiz() {
            quizAnswers = {};
            currentQuizQuestion = 1;

            // Reset all questions
            document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
            document.querySelector('[data-question="1"]').classList.add('active');

            // Reset progress dots
            document.querySelectorAll('.progress-dot').forEach((dot, index) => {
                dot.classList.remove('active', 'completed');
                if (index === 0) dot.classList.add('active');
            });

            // Reset all selected options
            document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));

            // Show quiz nav, hide result
            document.getElementById('quizNav').style.display = 'flex';
            document.getElementById('quizResult').classList.remove('active');
            document.getElementById('quizQuestions').style.display = 'block';

            updateNavButtons();
        }

        function selectAnswer(questionNum, answer) {
            quizAnswers[questionNum] = answer;

            // Update UI
            const questionDiv = document.querySelector(`[data-question="${questionNum}"]`);
            questionDiv.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
            event.target.closest('.quiz-option').classList.add('selected');

            // Enable next button
            updateNavButtons();

            // Auto advance after selection (optional smooth flow)
            setTimeout(() => {
                if (questionNum < 6) {
                    nextQuestion();
                } else {
                    showResults();
                }
            }, 500);
        }

        function updateNavButtons() {
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');

            prevBtn.disabled = currentQuizQuestion === 1;
            nextBtn.disabled = !quizAnswers[currentQuizQuestion];

            if (currentQuizQuestion === 6 && quizAnswers[6]) {
                nextBtn.textContent = 'Ver Resultado 🎉';
            } else {
                nextBtn.textContent = 'Próxima →';
            }
        }

        function nextQuestion() {
            if (!quizAnswers[currentQuizQuestion]) return;

            // Mark current as completed
            document.querySelectorAll('.progress-dot')[currentQuizQuestion - 1].classList.add('completed');
            document.querySelectorAll('.progress-dot')[currentQuizQuestion - 1].classList.remove('active');

            if (currentQuizQuestion < 6) {
                currentQuizQuestion++;

                // Update active question
                document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
                document.querySelector(`[data-question="${currentQuizQuestion}"]`).classList.add('active');

                // Update progress
                document.querySelectorAll('.progress-dot')[currentQuizQuestion - 1].classList.add('active');

                updateNavButtons();
            } else {
                showResults();
            }
        }

        function previousQuestion() {
            if (currentQuizQuestion > 1) {
                // Remove completed from current
                document.querySelectorAll('.progress-dot')[currentQuizQuestion - 1].classList.remove('active', 'completed');

                currentQuizQuestion--;

                // Update active question
                document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
                document.querySelector(`[data-question="${currentQuizQuestion}"]`).classList.add('active');

                // Update progress
                document.querySelectorAll('.progress-dot')[currentQuizQuestion - 1].classList.add('active');
                document.querySelectorAll('.progress-dot')[currentQuizQuestion - 1].classList.remove('completed');

                updateNavButtons();
            }
        }

        function showResults() {
            // Count answers
            const counts = { a: 0, b: 0, c: 0, d: 0 };
            Object.values(quizAnswers).forEach(answer => counts[answer]++);

            // Determine result
            let maxCount = Math.max(counts.a, counts.b, counts.c, counts.d);
            let result;

            if (counts.a === maxCount) {
                result = {
                    icon: '🎵',
                    title: 'Seu Estilo é SAMBA!',
                    genre: 'samba',
                    description: 'Você gosta de tradição, conexão com raízes e celebra a vida de forma coletiva. O samba é a sua essência, cheio de gingado, história e alegria brasileira!'
                };
            } else if (counts.b === maxCount) {
                result = {
                    icon: '🎶',
                    title: 'Seu Estilo é PAGODE!',
                    genre: 'pagode',
                    description: 'Você busca leveza, descontração e prefere curtir a vida em momentos simples, mas cheios de risadas. O pagode é perfeito para você, com seu clima de bar e amizade!'
                };
            } else if (counts.c === maxCount) {
                result = {
                    icon: '🌞',
                    title: 'Seu Estilo é AXÉ!',
                    genre: 'axe',
                    description: 'Sua marca é energia, alegria e movimento. Você contagia as pessoas e vive como se estivesse em um eterno carnaval. O axé é pura energia baiana!'
                };
            } else {
                result = {
                    icon: '🔥',
                    title: 'Seu Estilo é FUNK!',
                    genre: 'funk',
                    description: 'Você é intensidade pura. Gosta de batidas fortes, liberdade de expressão e viver a vida no ritmo da adrenalina. O funk é sua identidade sonora!'
                };
            }

            // Display result
            document.getElementById('resultIcon').textContent = result.icon;
            document.getElementById('resultTitle').textContent = result.title;
            document.getElementById('resultDescription').textContent = result.description;

            // Store selected genre
            window.selectedQuizGenre = result.genre;

            // Hide questions and nav, show result
            document.getElementById('quizQuestions').style.display = 'none';
            document.getElementById('quizNav').style.display = 'none';
            document.getElementById('quizResult').classList.add('active');
        }

        function restartQuiz() {
            resetQuiz();
        }

        function applyGenreAndClose() {
            if (window.selectedQuizGenre) {
                // Apply the genre to the main page
                currentGenre = window.selectedQuizGenre;

                // Update genre button selection
                document.querySelectorAll('.genre-btn').forEach(btn => {
                    btn.classList.remove('active');
                });

                // Find and activate the matching genre button
                const genreMap = {
                    'samba': 'samba',
                    'pagode': 'pagode',
                    'axe': 'axe',
                    'funk': 'funk'
                };

                const targetGenre = genreMap[window.selectedQuizGenre];
                document.querySelectorAll('.genre-btn').forEach(btn => {
                    if (btn.textContent.toLowerCase().includes(targetGenre)) {
                        btn.classList.add('active');
                    }
                });

                // Update song info
                selectGenre(window.selectedQuizGenre);

                // Show success message
                document.getElementById('instructionText').textContent = `Perfeito! Agora você vai aprender ${currentGenre.toUpperCase()}! Comece escolhendo os passos e divirta-se! 🎉`;
            }

            closeQuiz();
        }

        // Update overlay click handler to include quiz modal
        overlay.addEventListener('click', () => {
            if (document.getElementById('stageModal').classList.contains('active')) {
                closeStage();
            } else if (document.getElementById('quizModal').classList.contains('active')) {
                closeQuiz();
            } else {
                sidebar.classList.remove('open');
                mainContent.classList.remove('shifted');
                overlay.classList.remove('active');
            }
        });

       