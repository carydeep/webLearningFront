import React, { ReactElement, useState } from 'react';
import { motion } from 'framer-motion'
import { useRouter } from 'next/router';
import styles from '../../styles/ProfileLayout.module.css'
import Link from 'next/link'
import { appearAndmoveDown, appearToRight } from '../../animation';

function ProfileLayout({ children }: { children: ReactElement }) {
    const router = useRouter().pathname
    return (
        <div className='row'>
            <motion.div
                className={`col-4 col-lg-2 col-md-3`}
                variants={appearToRight}
                initial='hidden'
                animate='visible'
                transition={{type: 'spring',delay: 0.4}}
            >
                <div className={styles.bar}>
                    <Link href='/user/profile/changepass'>
                        <a className={`${styles.bar_button} ${router === '/user/profile/changepass' ? styles.active : null}`}>Đổi mật khẩu</a>
                    </Link>
                    <Link href='/user/profile/changeprofile'>
                        <a className={`${styles.bar_button} ${router === '/user/profile/changeprofile' ? styles.active : null}`}>Đổi thông tin</a>
                    </Link>
                </div>
            </motion.div>
            <motion.div
                className={`col-8 col-lg-10 col-md-9 ${styles.content}`}
                variants={appearAndmoveDown}
                initial='hidden'
                animate='visible'
                transition= {{type: 'spring',delay: 0.6}}
            >
                {children}
            </motion.div>
        </div>
    );
}

export default ProfileLayout;