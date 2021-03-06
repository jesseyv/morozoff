# -*- coding: utf-8 -*-
from fabric.api import *
from fabric.colors import *

PROJECTS_ROOT = '/var/www/projects/'

PROJECT_REPO_SSH_URL = local('git config --get remote.origin.url', capture=True)
PROJECT_REPO_GIT_URL = 'git://{0}'.format(PROJECT_REPO_SSH_URL.split('@')[1].replace(':', '/'))
PROJECT_REPO_NAME = local('basename {0} .git'.format(PROJECT_REPO_SSH_URL), capture=True)

DEPLOY_USER = 'www-data'

PACKAGES = ['libmemcached-dev']

def _sudo(command):
    env.sudo_prefix = "sudo -S -i -p '%(sudo_prompt)s'"
    return sudo(command, user=DEPLOY_USER)

def enable_proj():
    print(green('Enabling project serving'))
    run('ln -s -f {0}{1}/uwsgi.ini /etc/uwsgi/apps-enabled/{1}.ini'.format(PROJECTS_ROOT, PROJECT_REPO_NAME))
    run('ln -s -f {0}{1}/nginx.conf /etc/nginx/sites-available/{1}'.format(PROJECTS_ROOT, PROJECT_REPO_NAME))
    run('ln -s -f /etc/nginx/sites-available/{0} /etc/nginx/sites-enabled/{0}'.format(PROJECT_REPO_NAME))
    restart_proj()

def disable_proj():
    print(green('Disabling project serving'))
    run('rm /etc/uwsgi/apps-enabled/{0}.ini'.format(PROJECT_REPO_NAME))
    run('rm /etc/nginx/sites-enabled/{0}'.format(PROJECT_REPO_NAME))

def restart_proj():
    with settings(warn_only=True):
        print(green('Restarting project serving'))
        run('touch /etc/uwsgi/apps-enabled/{}.ini'.format(PROJECT_REPO_NAME))
        run('service nginx reload')

def deploy_init():
    if PACKAGES:
        print(green('Installing dependencies'))
        run('apt-get -yq --force-yes install {0}'.format(' '.join(PACKAGES)))

    with settings(warn_only=True):
        with cd(PROJECTS_ROOT):
            if run('test -d {0}'.format(PROJECT_REPO_NAME)).failed:
                print(green('Cloning project\'s repo'))
                _sudo('git clone {0}'.format(PROJECT_REPO_GIT_URL))

            with cd(PROJECT_REPO_NAME):
                print(green('Updating project\'s repo'))
                _sudo('git reset --hard HEAD; git pull')
                put('{0}/local_settings.py'.format(PROJECT_REPO_NAME), '{0}{1}'.format(PROJECTS_ROOT, PROJECT_REPO_NAME))
                run('chown {0}:{0} local_settings.py'.format(DEPLOY_USER))
                #put('fixtures', '{0}{1}'.format(PROJECTS_ROOT, PROJECT_REPO_NAME))
                #run('chown -R {0}:{0} fixtures'.format(DEPLOY_USER))
                WORK_HOME = _sudo('echo $WORKON_HOME')

                if run('test -d {0}/{1}'.format(WORK_HOME, PROJECT_REPO_NAME)).failed:
                    print(green('Creating virtualenv for project'))
                    _sudo('mkvirtualenv {}'.format(PROJECT_REPO_NAME))

                with prefix('workon {}'.format(PROJECT_REPO_NAME)):
                    print(green('Installing required packets'))
                    _sudo('pip install -r requirements.txt')

                    print(green('Syncing DB'))
                    _sudo('python manage.py syncdb --noinput --migrate')

                    print(green('Migrating DB'))
                    _sudo('python manage.py migrate --noinput')

                    print(green('Collecting static'))
                    _sudo('python manage.py collectstatic --noinput')

                    #print(green('Installing fixtures'))
                    #_sudo('python manage.py loaddata fixtures/*.json')

    enable_proj()
