// Comprobamos que el formulario existe antes de ejecutar el código
// (Esto evita errores si el script se carga en otra página)
const testForm = document.getElementById('levelTestForm');

if (testForm) {
    testForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita que la página se recargue

        // 1. Clave de respuestas correctas
        const answerKey = {
            q1: "A", q2: "B", q3: "A", q4: "C", q5: "B",
            q6: "A", q7: "C", q8: "B", q9: "C", q10: "A",
            q11: "A", q12: "A", q13: "B", q14: "A", q15: "C",
            q16: "A", q17: "B", q18: "B", q19: "A", q20: "C"
        };

        let score = 0;
        const formData = new FormData(this);

      // 2. Comparar respuestas y pintar de colores
        for (let [question, answer] of formData.entries()) {
            const isCorrect = answerKey[question] === answer;
            
            if (isCorrect) {
                score++;
            } else {
                console.log(`❌ Fallo en ${question}: Tú elegiste "${answer}", pero la correcta es "${answerKey[question]}".`);
            }

            // Pintar la opción seleccionada de verde o rojo
            const selectedInput = document.querySelector(`input[name="${question}"][value="${answer}"]`);
            if (selectedInput) {
                const label = selectedInput.closest('.option-label');
                if (isCorrect) {
                    label.style.backgroundColor = '#dff5df'; // Verde
                    label.style.borderColor = '#9acb9a';
                    label.style.color = '#245b24';
                } else {
                    label.style.backgroundColor = '#f5d6d6'; // Rojo
                    label.style.borderColor = '#d99a9a';
                    label.style.color = '#7a2222';
                }
            }
        }

        // 3. Calcular Nivel (Baremo)
        let level = "";
        let recommendation = "";

        if (score <= 5) {
            level = "A1 (Inicial)";
            recommendation = "Te recomendamos el curso de Nivel A1 - Principiantes. ¡Empezarás con una base sólida!";
        } else if (score <= 9) {
            level = "A2 (Básico)";
            recommendation = "Te recomendamos el curso de Nivel A2. Mejorarás tu fluidez y gramática básica.";
        } else if (score <= 13) {
            level = "B1 (Intermedio)";
            recommendation = "¡Muy bien! Tu nivel es B1. Te vendrá genial el curso de Nivel Intermedio para soltarte a hablar.";
        } else if (score <= 17) {
            level = "B2 (Avanzado)";
            recommendation = "¡Impresionante! Tienes un gran control. Te recomendamos el curso B2 o nuestras clases de conversación.";
        } else {
            level = "C1 (Superior)";
            recommendation = "¡Felicidades! Tienes un nivel muy alto. Te recomendamos perfeccionar con clases de conversación avanzada o español de negocios.";
        }

        // 4. Mostrar resultados
        testForm.style.display = 'none'; // Ocultar preguntas
        const resultBox = document.getElementById('testResult');
        resultBox.style.display = 'block'; // Mostrar caja
        
        document.getElementById('resultText').innerHTML = `
            <strong>Has acertado ${score} de 20 preguntas.</strong><br><br>
            Tu nivel estimado es: <strong style="color: var(--primary); font-size: 1.4rem;">${level}</strong><br><br>
            ${recommendation}
        `;
        
        // Hacer scroll hacia arriba para ver el resultado
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}
