$content = Get-Content -Path "index.html" -Raw

# 1. Change themes
$content = [System.Text.RegularExpressions.Regex]::Replace($content, 'class="slide theme-(light|rose)(.*?)"', 'class="slide theme-dark$2"')

# Add custom CSS link
if ($content -notmatch 'custom.css') {
    $content = $content -replace '</head>', "<link rel=`"stylesheet`" href=`"assets/custom.css`">`n</head>"
}

# 2. Slide 3
$s3_regex = '(?s)(<section class="slide theme-dark" id="slide-3".*?<div class="slide-shell[^>]*>).*?(</section>)'
$s3_replacement = '$1
        <div class="slide-index">02</div>
        <div class="asymmetric-layout">
          <div class="roadmap-layout" style="grid-template-columns: 1fr; gap: 1rem;">
            <div class="roadmap-intro">
              <div class="roadmap-copy">
                <h2>Почему вокруг ИИ столько шума и путаницы</h2>
              </div>
            </div>
            <div class="roadmap-track">
              <article class="roadmap-item tone-soft">
                <span class="roadmap-node" aria-hidden="true"></span>
                <div class="roadmap-card">
                  <div class="roadmap-item-copy">
                    <p>Интерфейс похож, а механика внутри разная.</p>
                  </div>
                </div>
              </article>
              <article class="roadmap-item tone-rose">
                <span class="roadmap-node" aria-hidden="true"></span>
                <div class="roadmap-card">
                  <div class="roadmap-item-copy">
                    <p>Обычный чат и search-система решают разные типы задач.</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
          <div class="visual-placeholder">
            <span>[ Здесь должна быть абстрактная 3D-сцена: лабиринт из нейросетей, символизирующая запутанность и шум ]</span>
          </div>
        </div>
      </div>
    </section>'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $s3_regex, $s3_replacement)

# 3. Slide 5
$s5_regex = '(?s)(<section class="slide theme-dark" id="slide-5".*?<div class="type-head">.*?</div>).*?(</section>)'
$s5_replacement = '$1
        <div class="asymmetric-layout">
          <div class="type-body convo-layout" style="grid-template-columns: 1fr; gap: 0.8rem;">
            <article class="type-panel convo-strong type-panel-teal">
              <span class="type-eyebrow">Сильные стороны</span>
              <h3>Хороши как быстрый умный собеседник</h3>
              <ul class="type-list">
                <li>объясняют сложное простыми словами</li>
                <li>пишут, переписывают и переводят тексты</li>
              </ul>
            </article>
            <article class="type-panel convo-limits type-panel-rose">
              <span class="type-eyebrow">Слабые стороны</span>
              <h3>Слабы там, где нужен факт, а не формулировка</h3>
            </article>
            <article class="type-panel convo-use">
              <span class="type-eyebrow">Когда использовать</span>
              <div class="decision-tags good-tags">
                <span>объяснить тему</span><span>сделать summary</span>
              </div>
            </article>
          </div>
          <div class="visual-placeholder">
            <span>[ Визуал: Голографические текстовые пузыри чата, перетекающие в структуру документа ]</span>
          </div>
        </div>
      </div>
    </section>'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $s5_regex, $s5_replacement)

# 4. Slide 11
$s11_regex = '(?s)(<section class="slide theme-dark" id="slide-11".*?<div class="type-head">.*?</div>).*?(</section>)'
$s11_replacement = '$1
        <div class="asymmetric-layout-reverse">
          <div class="visual-placeholder" style="padding:0; border:none; background:transparent; box-shadow:none;">
            <img src="assets/visuals/tool-spectrum.svg" alt="Tool Spectrum" style="object-fit: contain; position: relative;">
          </div>
          <div class="type-body">
            <article class="type-panel omni-idea type-panel-dark">
              <span class="type-eyebrow">Что происходит</span>
              <h3>Пользователь видит один продукт, но внутри работает несколько режимов</h3>
              <p class="type-blurb">Один и тот же интерфейс может сначала ответить как чат, потом сходить в поиск, затем запустить код, прочитать изображение и собрать финальный артефакт.</p>
            </article>
            <article class="type-panel omni-when type-panel-teal">
              <span class="type-eyebrow">Почему это важно</span>
              <ul class="type-list">
                <li>вы выбираете набор режимов внутри продукта</li>
                <li>ограничения и риски меняются от режима к режиму</li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $s11_regex, $s11_replacement)

# 5. Slide 12
$s12_regex = '(?s)(<section class="slide theme-dark" id="slide-12".*?<div class="section-head">.*?</div>).*?(</section>)'
$s12_replacement = '$1
        <div class="asymmetric-layout">
          <div class="eco-grid" style="grid-template-columns: 1fr; gap: 0.8rem;">
            <article class="eco-card" style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem;">
              <h3>Глобальные</h3>
              <div class="chip-set"><span>ChatGPT</span><span>Claude</span><span>Gemini</span></div>
            </article>
            <article class="eco-card" style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem;">
              <h3>Россия</h3>
              <div class="chip-set"><span>GigaChat</span><span>YandexGPT</span></div>
            </article>
            <article class="eco-card" style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem;">
              <h3>Китай</h3>
              <div class="chip-set"><span>DeepSeek</span><span>Qwen</span></div>
            </article>
          </div>
          <div class="visual-placeholder" style="padding:0; border:none; background:transparent; box-shadow:none;">
            <img src="assets/visuals/ai-landscape.svg" alt="AI Landscape" style="object-fit: contain; position: relative;">
          </div>
        </div>
      </div>
    </section>'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $s12_regex, $s12_replacement)

# 6. Slide 16
$s16_regex = '(?s)(<section class="slide theme-dark" id="slide-16".*?<div class="section-head">.*?</div>).*?(</section>)'
$s16_replacement = '$1
        <div class="asymmetric-layout-reverse">
          <div class="visual-placeholder" style="padding:0; border:none; background:transparent; box-shadow:none;">
            <img src="assets/visuals/security-zones.svg" alt="Security Zones" style="object-fit: contain; position: relative;">
          </div>
          <div class="safety-grid" style="grid-template-columns: 1fr; gap: 0.6rem;">
            <article class="safety-band band-ok" style="border-radius: 1rem;">
              <h3>Можно</h3><ul><li>публичные материалы</li><li>обезличенные примеры</li></ul>
            </article>
            <article class="safety-band band-care" style="border-radius: 1rem;">
              <h3>Осторожно</h3><ul><li>внутренние черновики</li><li>рабочие заметки</li></ul>
            </article>
            <article class="safety-band band-stop" style="border-radius: 1rem;">
              <h3>Нельзя по умолчанию</h3><ul><li>персональные данные</li><li>ключи, токены</li></ul>
            </article>
          </div>
        </div>
      </div>
    </section>'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $s16_regex, $s16_replacement)

# 7. Slide 18
$s18_regex = '(?s)(<section class="slide theme-dark" id="slide-18".*?<div class="section-head">.*?</div>).*?(</section>)'
$s18_replacement = '$1
        <div class="asymmetric-layout">
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="timeline-stage" style="grid-template-columns: 1fr; gap: 0.5rem; justify-items: start;">
              <div class="timeline-card" style="display: flex; gap: 1rem; align-items: center; border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 1rem; width: 100%;">
                <strong>01</strong><span>ввод</span>
              </div>
              <div class="timeline-card danger-tile" style="display: flex; gap: 1rem; align-items: center; border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 1rem; width: 100%;">
                <strong>04</strong><span>логи и следы</span>
              </div>
            </div>
            <div class="evidence-row" style="margin-top: 1rem;">
              <span>backup</span><span>audit log</span><span>memory</span><span>admin controls</span>
            </div>
          </div>
          <div class="visual-placeholder" style="padding:0; border:none; background:transparent; box-shadow:none;">
            <img src="assets/visuals/retention-cycle.svg" alt="Retention Cycle" style="object-fit: contain; position: relative;">
          </div>
        </div>
      </div>
    </section>'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $s18_regex, $s18_replacement)

# 8. Slide 19
$s19_regex = '(?s)(<section class="slide theme-dark" id="slide-19".*?<div class="section-grid section-grid-prompt">).*?(</section>)'
$s19_replacement = '$1
          <div style="display: flex; flex-direction: column; justify-content: center;">
            <h2>Из чего состоит сильный промпт</h2>
            <article class="prompt-card dark-prompt-card" style="margin-top: 2rem;">
              <span class="prompt-chip">Суть</span>
              <p class="prompt-note">Промпт-инжиниринг — это не магические фразы, а проектирование запроса так, чтобы модель поняла задачу и вернула полезный результат.</p>
            </article>
          </div>
          <div class="visual-placeholder" style="padding:0; border:none; background:transparent; box-shadow:none;">
            <img src="assets/visuals/prompt-stack.svg" alt="Prompt Stack" style="object-fit: contain; position: relative;">
          </div>
        </div>
      </div>
    </section>'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $s19_regex, $s19_replacement)

# 9. Slide 21
$s21_regex = '(?s)(<section class="slide theme-dark final-slide" id="slide-21".*?<div class="slide-shell">).*?(</section>)'
$s21_replacement = '$1
        <div class="slide-index">20</div>
        <div class="asymmetric-layout">
          <div class="final-grid" style="align-content: center; display: flex; flex-direction: column; justify-content: center;">
            <div>
              <h2 style="font-size: 2.8rem; line-height: 1.1;">Сильный пользователь ИИ сначала выбирает режим работы, потом проверяет контур данных, и только после этого пишет запрос.</h2>
            </div>
            <div class="hero-actions" style="margin-top: 2rem;">
              <a class="cta hero-cta-primary" href="materials/lecture.md">Развернутый доклад</a>
              <a class="cta cta-secondary hero-cta-secondary" href="materials/sources.md">Источники</a>
            </div>
          </div>
          <div class="visual-placeholder">
            <span>[ Эпичная финальная графика: Светящееся ядро нейросети, пульсирующее в темном пространстве, символизирующее ясность и мощь инструмента ]</span>
          </div>
        </div>
      </div>
    </section>'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $s21_regex, $s21_replacement)

Set-Content -Path "index.html" -Value $content -Encoding UTF8
