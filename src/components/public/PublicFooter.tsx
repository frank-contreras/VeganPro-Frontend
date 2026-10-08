import { LocalizedText } from '../../localization/LocalizedText'

export function PublicFooter() {
  return <footer className="site-footer">
    <span className="footer-brand">VeganPro</span>
    <p><LocalizedText messageKey="footer.context" /></p>
    <p className="footer-disclosure"><LocalizedText messageKey="footer.disclosure" /></p>
  </footer>
}
