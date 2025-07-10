window.addEventListener('DOMContentLoaded', () => {
    const quizBlocks = document.querySelectorAll('.quiz__block');
    const prevBtn = document.querySelector('.quiz__prev-btn');
    const nextBtn = document.querySelector('.quiz__next-btn');
    const progressFill = document.querySelector('#progress-fill');
    const progressPercent = document.querySelector('#progress-percent');
    const quizTitle = document.querySelector('.quiz .main__title');
    const quizBottom = document.querySelector('.quiz__bottom');
    const finalMessage = document.querySelector('.final-message');
    const selected = document.querySelector('#district-select .selected');
    const customSelect = document.querySelector('.custom-select');
    const options = customSelect.querySelectorAll('.select-options li');
    const phoneInputs = document.querySelectorAll('[data-input="phone-input"]');

    const quizData = {};
    let quizStepIndex = 0;

    let stepOrder = [0, 1, 2, 3, 4, 6]; // стандартный маршрут
    const altStepOrder = [0, 1, 2, 3, 5, 4, 6]; // если < 200 кг

    function getRadioValue(name) {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : null;
    }

    function updateQuizView() {
        quizBlocks.forEach(block => block.classList.remove('show'));
        const currentRealStep = stepOrder[quizStepIndex];
        const currentBlock = document.querySelector(`.quiz__block[data-step="${currentRealStep}"]`);
        if (currentBlock) currentBlock.classList.add('show');

        const percent = Math.round((quizStepIndex / (stepOrder.length - 1)) * 100);
        progressFill.style.width = `${percent}%`;
        progressPercent.textContent = `${percent}%`;

        if (quizStepIndex > 0) quizTitle.classList.add('hide');
        else quizTitle.classList.remove('hide');

        if (currentRealStep === 6) {
            quizBottom.classList.add('final');
        } else {
            quizBottom.classList.remove('final');
        }

        nextBtn.querySelector('.quiz__next-title').textContent =
            quizStepIndex === 0 ? nextBtn.dataset.firstLabel || 'Начать' : 'Далее';

        if (currentRealStep === 5 || currentRealStep === 6) {
            collectQuizData();
            updateFinalMessage();
        }
    }

    function collectQuizData() {
        quizData.paperType = getRadioValue("paperType");
        quizData.paperAmount = getRadioValue("paperAmount");
        quizData.district = selected.dataset.value;
        quizData.phone = inputField.value.trim();
    }

    function updateFinalMessage() {
        if (quizData.paperAmount === "До 200") {
            finalMessage.textContent = "К сожалению, мы не сможем бесплатно забрать вашу макулатуру.";
        } else {
            finalMessage.textContent = "Вывезти вашу макулатуру будет стоить от 1800 рублей.";
        }
    }

    function validateCurrentStep() {
        const currentRealStep = stepOrder[quizStepIndex];
        const block = document.querySelector(`.quiz__block[data-step="${currentRealStep}"]`);
        const field = block?.dataset.field;

        if (!field) return true;

        switch (field) {
            case "paperType":
                return !!getRadioValue("paperType");
            case "paperAmount":
                return !!getRadioValue("paperAmount");
            case "district":
                return !!selected.dataset.value;
            case "phone":
                const phoneInput = block.querySelector('[data-input="phone-input"]');
                const rawPhone = phoneInput?.value.replace(/\D/g, '') || '';
                return rawPhone.length === 11;
            default:
                return true;
        }
    }

    function handleNext() {
        if (!validateCurrentStep()) {
            alert("Пожалуйста, заполните обязательное поле.");
            return;
        }

        const currentRealStep = stepOrder[quizStepIndex];

        if (currentRealStep === 2) {
            const answer = getRadioValue("paperAmount");
            stepOrder = answer === "До 200" ? [...altStepOrder] : [0, 1, 2, 3, 4, 6];
        }

        if (quizStepIndex < stepOrder.length - 1) {
            quizStepIndex++;
            updateQuizView();
        }
    }

    prevBtn.addEventListener('click', () => {
        if (quizStepIndex > 0) {
            quizStepIndex--;
            updateQuizView();
        }
    });

    nextBtn.addEventListener('click', handleNext);

    // обработка Enter
    document.addEventListener('keydown', e => {
        if (e.key === "Enter") {
            const currentRealStep = stepOrder[quizStepIndex];
            if (currentRealStep !== 6) {
                e.preventDefault();
                handleNext();
            }
        }
    });

    // кастомный селект
    selected.addEventListener('click', () => {
        customSelect.classList.toggle('open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.getAttribute('data-value');
            selected.textContent = value;
            selected.dataset.value = value;
            customSelect.classList.remove('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove('open');
        }
    });

    // Модалка
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('modalOverlay');

    openBtn.addEventListener('click', () => {
      modal.classList.add('show');
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });

    const modalSubmitBtn = document.querySelector('.modal__submit');
    const modalPhoneInput = document.querySelector('#modalOverlay [data-input="phone-input"]');

    modalSubmitBtn.addEventListener('click', () => {
        const rawPhone = modalPhoneInput?.value.replace(/\D/g, '') || '';

        if (rawPhone.length !== 11) {
            alert("Введите корректный номер телефона.");
            return;
        }

        // window.location.href = '../thanks.html';
        window.location.href = '/quiz/thanks.html';
    });

    if (IMask) {
        phoneInputs.forEach(input => {
            IMask(input, {
                mask: '+7 (000) 000-00-00'
            });
        });
    }

    updateQuizView();
});
