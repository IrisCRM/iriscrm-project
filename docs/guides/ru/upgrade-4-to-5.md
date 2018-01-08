Обновление Iris CRM с версии 4 до версии 5
==========================================

Инстурукция актуальна для случая, когда настройки в Iris CRM 4 выполнялись
согласно [рекоментациям](http://iris-crm.ru/recommendations-for-customization) 
по выполнению настроек.

1. [Обновите](http://iris-crm.ru/auto-update-instruction) Iris CRM 4 до последней версии (`4.0.40`).

1.  Установите Iris CRM 5 согласно 
[инструкции по установке](installation.md) за исключением некоторых пунктов:
    - не создавайте новую БД
    - в параметры соединения с БД укажите данные от БД версии Iris CRM 4
    - перед выполнением миграций выполните команду пропуска первой миграции (эта миграция содержит структуру базы и на уже имеющейся базе ее выполнять не нужно):
      ```
      ./iris iris:mark-initial-migration
      ```

1.  Создайте и зарегистрируйте пространство имен для ведения 
пользовательских настроек [согласно инструкции](customization.md).
Например, в `src/MyCompany/Config/ConfigName`.

1.  Скопируйте в созданный каталог файлы с со слоем настроек 
для вашей компании из конфигурации 4-й версии системы. 
Как правило, это файлы с постфиксом _custom.

    ```bash
    cd path/to/iriscrm_4/config
     
    # Просмотр списка копируемых файлов
    find . -name *_custom.*
     
    # Копирование файлов
    rsync -avm --include='*/' --include='*_custom.*' --exclude='*' . /path/to/iriscrm5/src/MyCompany/Config/ConfigName
    ```

1.  Переименуйте файлы удалив из названий `_custom`
и сделав в файлах с расширением php заглавными символы, 
следующие после символа `_`. 
Например, `c_task_custom.php` -> `c_Task.php`.

    ```bash
    cd /path/to/iriscrm5/src/MyCompany/Config/ConfigName
    find . -type f -exec rename 's/_custom//' '{}' \;
    find . -type f -name *.php -exec rename 's/_(\w)/_\u$1/g' '{}' \;
    ```
1.  В полученных php файлах необходимо добавить первыми строчками файла
указание неймспейса, в котором находится класс и указать через `use` 
используемые в коде классы. 
Также необходимо переименовать название класса,
чтобы оно совпадало с названием файла.
Например, для скрипта 
`src/MyCompany/Config/ConfigName/sections/Account/s_Account.php`:

    ```php
    namespace MyCompany/Config/ConfigName\sections\Account;
     
    use Iris\Config\CRM\sections\Account\s_Account as s_AccountBase;
     
    class s_Account extends s_AccountBase
    ```
